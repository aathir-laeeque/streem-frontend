import { Button, formatOptionLabel, FormGroup } from '#components';
import { apiGetObjectTypes } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Choice, ObjectType } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { isArray, keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import styled from 'styled-components';
import { getDateUnits, labelByConstraint } from '../ValidationViews/Resource';

export const FilterWrapper = styled.div`
  .filters-constraint {
    max-width: 100px;
    > div {
      margin-bottom: 0 !important;
    }
  }
  .filters {
    margin-left: 50px;
    margin-bottom: 38px;
    padding-left: 18px;
    padding-block: 24px;
    background-image: linear-gradient(#6f6f6f 33%, rgba(255, 255, 255, 0) 0%);
    background-position: left;
    background-size: 1px 3px;
    background-repeat: repeat-y;
    position: relative;

    .add-button {
      padding: 6px 8px;
      position: absolute;
      bottom: -19px;
      :before {
        content: '';
        display: inline-block;
        height: 1px;
        position: absolute;
        vertical-align: middle;
        width: 18px;
        left: -18px;
        border-top: 1px dotted #6f6f6f;
      }
    }

    .filter {
      margin-bottom: 8px;

      :last-of-type {
        margin-bottom: 0;
      }

      .upper-row {
        display: flex;
        align-items: center;
        gap: 16px;
        :before {
          content: '';
          display: inline-block;
          height: 1px;
          position: absolute;
          vertical-align: middle;
          width: 18px;
          left: 0;
          border-top: 1px dotted #6f6f6f;
        }

        .remove-icon {
          cursor: pointer;
          margin-top: 6px;
          font-size: 16px;
        }
      }
    }
  }
  .form-group {
    flex: 1;
    flex-direction: row;
    gap: 16px;

    > div {
      flex: 1;
      margin-bottom: 16px;
    }
  }

  .custom-select__menu {
    z-index: 2;
  }
`;

type ResourceFilterState = {
  isActiveLoading: boolean;
  filterSelectOptions: Record<number, Choice[]>;
  selectedObjectType?: ObjectType;
};

const ResourceFilter: FC<{ form: UseFormMethods<any> }> = ({ form }) => {
  const { watch, setValue } = form;
  const data = watch('data', {
    propertyFilters: [],
  });
  const [state, setState] = useState<ResourceFilterState>({
    isActiveLoading: true,
    filterSelectOptions: {},
  });
  const { propertyFilters = [] } = data;
  const { isActiveLoading, selectedObjectType, filterSelectOptions } = state;
  const propertiesMap = useRef<Record<string, any>>({});

  const fetchObjectType = async (id: string) => {
    setState((prev) => ({ ...prev, isActiveLoading: true }));
    const res: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
    if (res.data) {
      propertiesMap.current = keyBy(res.data.properties || [], 'id');
      updateFilterOptions(res.data, propertyFilters);
    }
    setState((prev) => ({ ...prev, isActiveLoading: false, selectedObjectType: res.data }));
  };

  const updateFilterOptions = (objectType: ObjectType, filter: any[]) => {
    const updatedOptions: Record<number, Choice[]> = {};
    filter.forEach((filter: any, index: number) => {
      updatedOptions[index] = propertiesMap.current?.[filter.propertyId]?.options || [];
    });
    setState((prev) => ({ ...prev, filterSelectOptions: updatedOptions }));
  };

  useEffect(() => {
    if (data?.objectTypeId) {
      fetchObjectType(data.objectTypeId);
    }
  }, [data?.objectTypeId]);

  const updateFilters = (updatedFilters: any) => {
    setValue(
      'data',
      {
        ...data,
        propertyFilters: updatedFilters,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <FilterWrapper>
      <FormGroup
        className="filters-constraint"
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'filterConstraint',
              options: [
                {
                  label: 'AND',
                  value: 'AND',
                },
                {
                  label: 'OR',
                  value: 'OR',
                },
              ],
              isSearchable: false,
              defaultValue: [
                {
                  label: 'AND',
                  value: 'AND',
                },
              ],
              placeholder: 'Select Unit',
              onChange: (value: any) => {
                // propertyFilters[index] = {
                //   ...propertyFilters[index],
                //   dateUnit: value.value,
                // };
                // updateFilters(propertyFilters);
              },
            },
          },
        ]}
      />
      <div className="filters">
        {propertyFilters.map((item: any, index: number) => (
          <div className="filter" key={index}>
            <div className="upper-row">
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectProperty',
                      formatOptionLabel,
                      label: 'Object Property',
                      isLoading: isActiveLoading,
                      options: selectedObjectType?.properties.map((objectTypeProperty) => ({
                        _options: objectTypeProperty.options,
                        externalId: objectTypeProperty.externalId,
                        label: objectTypeProperty.displayName,
                        value: objectTypeProperty.id,
                        inputType: objectTypeProperty.inputType,
                      })),
                      value: item?.propertyId
                        ? [
                            {
                              label: item.propertyDisplayName,
                              value: item.propertyId,
                            },
                          ]
                        : undefined,
                      isSearchable: false,
                      placeholder: 'Select Object Property',
                      onChange: (value: any) => {
                        propertyFilters[index] = {
                          propertyId: value.value,
                          propertyInputType: value.inputType,
                          propertyExternalId: value.externalId,
                          propertyDisplayName: value.label,
                        };
                        updateFilters(propertyFilters);
                        if (
                          [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                            value.inputType,
                          )
                        ) {
                          setState((prev) => ({
                            ...prev,
                            filterSelectOptions: {
                              ...prev.filterSelectOptions,
                              [index]: value._options,
                            },
                          }));
                        } else {
                          setState((prev) => ({
                            ...prev,
                            filterSelectOptions: { ...prev.filterSelectOptions, [index]: [] },
                          }));
                        }
                      },
                    },
                  },
                  ...(item?.propertyInputType
                    ? [
                        {
                          type: InputTypes.SINGLE_SELECT,
                          props: {
                            id: 'objectPropertyCondition',
                            label: 'Condition',
                            options: Object.entries(labelByConstraint(item.propertyInputType)).map(
                              ([value, label]) => ({ label, value }),
                            ),
                            isSearchable: false,
                            placeholder: 'Select Condition',
                            value: item?.constraint
                              ? [
                                  {
                                    label: (labelByConstraint(item.propertyInputType) as any)[
                                      item.constraint
                                    ],
                                    value: item.constraint,
                                  },
                                ]
                              : undefined,
                            onChange: (value: any) => {
                              propertyFilters[index] = {
                                ...propertyFilters[index],
                                constraint: value.value,
                              };
                              updateFilters(propertyFilters);
                            },
                          },
                        },
                        ...([InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                          item.propertyInputType,
                        )
                          ? [
                              {
                                type: item.propertyInputType,
                                props: {
                                  id: 'objectPropertyValue',
                                  label: 'Value',
                                  placeholder: 'Select Property Option',
                                  isSearchable: false,
                                  options: (filterSelectOptions?.[index] || []).map((option) => ({
                                    label: option.displayName,
                                    value: option.id,
                                  })),
                                  value: (item?.options || []).map((option: any) => ({
                                    label: option.displayName,
                                    value: option.id,
                                  })),
                                  onChange: (value: any) => {
                                    propertyFilters[index] = {
                                      ...propertyFilters[index],
                                      options: isArray(value)
                                        ? value.map((v) => ({
                                            id: v.value,
                                            displayName: v.label,
                                          }))
                                        : [
                                            {
                                              id: value.value,
                                              displayName: value.label,
                                            },
                                          ],
                                    };
                                    updateFilters(propertyFilters);
                                  },
                                },
                              },
                            ]
                          : [
                              {
                                type: [
                                  InputTypes.DATE,
                                  InputTypes.TIME,
                                  InputTypes.DATE_TIME,
                                ].includes(item.propertyInputType)
                                  ? InputTypes.NUMBER
                                  : item.propertyInputType,
                                props: {
                                  id: 'objectPropertyValue',
                                  label: 'Value',
                                  placeholder: 'Enter Value',
                                  defaultValue: item?.value,
                                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                    propertyFilters[index] = {
                                      ...propertyFilters[index],
                                      value: e.target.value,
                                    };
                                    updateFilters(propertyFilters);
                                  },
                                },
                              },
                            ]),
                      ]
                    : []),
                ]}
              />
              <Close
                className="remove-icon"
                onClick={() => {
                  const updated = [...propertyFilters];
                  updated.splice(index, 1);
                  updateFilters(updated);
                  updateFilterOptions(selectedObjectType!, updated);
                }}
              />
            </div>
            {item?.propertyInputType &&
              [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                item.propertyInputType,
              ) && (
                <FormGroup
                  inputs={[
                    {
                      type: InputTypes.SINGLE_SELECT,
                      props: {
                        id: 'objectPropertyUnit',
                        label: 'Unit',
                        options: Object.entries(getDateUnits(item.propertyInputType)).map(
                          ([value, label]) => ({
                            label,
                            value,
                          }),
                        ),
                        isSearchable: false,
                        placeholder: 'Select Unit',
                        defaultValue: item?.dateUnit
                          ? [
                              {
                                label: getDateUnits(item.propertyInputType)[
                                  item.dateUnit as keyof typeof getDateUnits
                                ],
                                value: item.dateUnit,
                              },
                            ]
                          : undefined,
                        onChange: (value: any) => {
                          propertyFilters[index] = {
                            ...propertyFilters[index],
                            dateUnit: value.value,
                          };
                          updateFilters(propertyFilters);
                        },
                      },
                    },
                  ]}
                />
              )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="add-button"
          onClick={() => {
            updateFilters([...propertyFilters, {}]);
          }}
        >
          <AddCircleOutline style={{ marginRight: 8 }} /> Add
        </Button>
      </div>
    </FilterWrapper>
  );
};

export default ResourceFilter;
