import { Parameter, TargetEntityType } from '#PrototypeComposer/checklist.types';
import { Button, FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { MandatoryParameter } from '#types';
import { apiGetObjectTypes, apiGetParameters, baseUrl } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER } from '#utils/constants';
import { customOnChange } from '#utils/formEvents';
import {
  FilterField,
  FilterOperators,
  InputTypes,
  ResponseObj,
  fetchDataParams,
} from '#utils/globalTypes';
import { request } from '#utils/request';
import { Choice, ObjectType } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { capitalize, keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { getDateUnits, labelByConstraint } from '../ValidationViews/Resource';

export const FilterWrapper = styled.div`
  .filters-constraint {
    max-width: 140px;
    > div {
      margin-bottom: 0 !important;
    }
  }
  .filters {
    padding-bottom: 24px;

    .add-button {
      padding: 6px 8px;
    }

    .filter {
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      :last-of-type {
        margin-bottom: 0;
      }

      .filter-header {
        background-color: #f4f4f4;
        padding: 12px;
        > div {
          font-size: 14px;
          font-weight: 700;
        }
      }

      .filter-text {
        font-size: 14px;
        font-weight: 400;
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

    > div:last-child {
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
  relationObjects?: Record<string, any[]>;
  parametersData?: any;
  parametersFilterFields: FilterField[];
  allParametersData?: Record<string, Parameter>;
};

const ResourceFilter: FC<{
  form: UseFormMethods<any>;
  isReadOnly: boolean;
  parameter?: Parameter;
  checklistId?: string;
  isVariationView?: boolean;
}> = ({ form, isReadOnly, parameter, checklistId, isVariationView = false }) => {
  const { watch, setValue, clearErrors, setError } = form;
  const data = watch('data', {
    propertyFilters: { op: '', fields: [] },
  });

  const { propertyFilters = {} } = data;
  const { op = '', fields = [] } = propertyFilters || {};

  const updateFilters = (updatedFilters: any) => {
    const isFilter = updatedFilters?.fields?.length;
    const isOp = updatedFilters?.op;
    let isValid = true;
    if (updatedFilters?.fields?.length) {
      if (!updatedFilters?.op) {
        isValid = false;
      } else {
        updatedFilters.fields.every((filter: any) => {
          if (!filter) return true;
          let keyToValidate = ['field', 'op'];
          if (filter?.selector === 'CONSTANT') {
            keyToValidate.push('values');
          } else if (filter?.selector === 'PARAMETER') {
            keyToValidate = [...keyToValidate, 'referencedParameterId'];
          } else {
            keyToValidate = [...keyToValidate, 'values'];
          }
          keyToValidate.every((key) => {
            const checkSingleProperty = !!filter?.[key]?.length;
            if (!checkSingleProperty) {
              isValid = false;
            }
            return isValid;
          });
          return isValid;
        });
      }
    } else if (updatedFilters?.op) {
      isValid = false;
    }
    setValue(
      'data',
      {
        ...data,
        propertyFilters:
          isOp || isFilter
            ? {
                ...(isOp && { op: updatedFilters.op }),
                ...(isFilter && { fields: updatedFilters.fields }),
              }
            : null,
      },
      {
        shouldDirty: true,
      },
    );
    if (!isValid) {
      setError('data', {
        message: 'All Filters Options Should be Filled.',
      });
    } else {
      clearErrors('data');
    }
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
                // {
                //   label: 'OR',
                //   value: 'OR',
                // },
              ],
              isSearchable: false,
              isDisabled: isReadOnly,
              isClearable: true,
              defaultValue: op
                ? [
                    {
                      label: op,
                      value: op,
                    },
                  ]
                : null,
              placeholder: 'Select One',
              onChange: (value: any) => {
                const _propertyFilters = {
                  ...data.propertyFilters,
                  op: value?.value ?? null,
                };
                updateFilters(_propertyFilters);
              },
            },
          },
        ]}
      />
      <div className="filters">
        <ResourceFormCard
          parameter={parameter}
          isReadOnly={isReadOnly}
          updateFilters={updateFilters}
          form={form}
          checklistId={checklistId}
          isVariationView={isVariationView}
        />
        {!isReadOnly && !isVariationView && (
          <Button
            type="button"
            variant="secondary"
            className="add-button"
            onClick={() => {
              fields[fields.length] = {
                key: uuidv4(),
                id: uuidv4(),
              };

              const _propertyFilters = {
                ...data.propertyFilters,
                fields,
              };

              updateFilters(_propertyFilters);
            }}
          >
            <AddCircleOutline style={{ marginRight: 8 }} /> Add
          </Button>
        )}
      </div>
    </FilterWrapper>
  );
};

const ResourceFormCard: FC<{
  form: UseFormMethods<any>;
  isReadOnly: boolean;
  isVariationView: boolean;
  parameter?: Parameter;
  updateFilters: (updatedFilters: any) => void;
  checklistId?: string;
}> = ({ parameter, isReadOnly, updateFilters, form, checklistId, isVariationView = false }) => {
  const [state, setState] = useState<ResourceFilterState>({
    isActiveLoading: true,
    filterSelectOptions: {},
    relationObjects: {},
    parametersData: {},
    parametersFilterFields: [],
    allParametersData: {},
  });
  const {
    isActiveLoading,
    selectedObjectType,
    filterSelectOptions,
    relationObjects,
    parametersData,
    parametersFilterFields,
    allParametersData,
  } = state;

  const parameterOptionsList =
    parameter?.targetEntityType === TargetEntityType.PROCESS
      ? parametersData?.data?.filter(
          (currParam: Parameter) => currParam.targetEntityType === TargetEntityType.PROCESS,
        )
      : parametersData?.data;

  const { watch } = form;

  const data = watch('data', {
    propertyFilters: { op: '', fields: [] },
  });

  const propertiesMap = useRef<Record<string, any>>({});

  const { propertyFilters = {} } = data;
  const { fields = [] } = propertyFilters || {};

  const pagination = useRef({});

  if (!checklistId) {
    const { data: processData } = useTypedSelector((state) => state.prototypeComposer);
    checklistId = processData?.id;
  }

  const fetchRelationObjects = async (urlPath: string, externalId: string) => {
    setState((prev) => ({ ...prev, isActiveLoading: true }));
    if (!pagination?.current[externalId]) {
      pagination.current = { ...pagination.current, [externalId]: { current: -1, isLast: false } };
    }
    try {
      const response: ResponseObj<any> = await request(
        'GET',
        `${baseUrl}${urlPath}&page=${pagination.current[externalId].current + 1}`,
      );
      if (response?.data) {
        if (response?.pageable) {
          pagination.current = {
            ...pagination.current,
            [externalId]: { current: response.pageable?.page, isLast: response.pageable?.last },
          };
        }
        setState((prev) => ({
          ...prev,
          relationObjects: {
            ...prev.relationObjects,
            [externalId]: [...(prev?.relationObjects[externalId] || []), ...(response?.data || [])],
          },
          isActiveLoading: false,
        }));
      }
    } catch (e) {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleConstantValue = (updatedFilters: any) => {
    customOnChange(updatedFilters, (updatedFilters: any) => {
      updateFilters(updatedFilters);
    });
  };

  const updateFilterOptions = (filter: any[]) => {
    const updatedOptions: Record<number, Choice[]> = {};
    filter.forEach((filter: any, index: number) => {
      if (filter)
        updatedOptions[index] =
          propertiesMap.current?.[filter.field?.split('.')?.[1]]?.options || [];
    });
    setState((prev) => ({ ...prev, filterSelectOptions: updatedOptions }));
  };

  const fetchObjectType = async (id: string) => {
    setState((prev) => ({ ...prev, isActiveLoading: true }));
    const res: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
    if (res?.data) {
      propertiesMap.current = keyBy(
        [...(res?.data?.properties || []), ...(res?.data?.relations || [])] || [],
        'id',
      );
      updateFilterOptions(fields);
    }
    setState((prev) => ({ ...prev, isActiveLoading: false, selectedObjectType: res?.data }));
  };

  const fetchParametersData = async (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = 2560, filters = parametersFilterFields } = params;
    // TODO: size is increased to 2560 to fetch all parameters at once cause mongo filter doesnt support for data.objectTypeId in case of resource type call.
    if (checklistId) {
      try {
        const response: ResponseObj<any> = await request('GET', apiGetParameters(checklistId), {
          params: {
            page,
            size,
            filters: {
              op: FilterOperators.AND,
              fields: [{ field: 'archived', op: FilterOperators.EQ, values: [false] }, ...filters],
            },
            sort: 'id,desc',
          },
        });
        if (response.data) {
          setState((prev) => ({
            ...prev,
            parametersData: {
              data:
                response?.pageable?.page === 0
                  ? response.data
                  : [...prev.parametersData.data, ...response.data],
              pageable: response.pageable,
            },
            allParametersData: { ...prev.allParametersData, ...keyBy(response.data, 'id') },
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const fieldKeysCorrection = (index: number) => {
    const updatedFields = {} as Record<string, any>;
    const keysToInclude = ['field', 'op', 'id', 'fieldType'];
    Object.keys(fields[index]).forEach((key) => {
      if (keysToInclude.includes(key)) {
        updatedFields[key] = fields[index][key];
      }
    });
    fields[index] = updatedFields;
  };

  useEffect(() => {
    if (data?.objectTypeId) {
      fetchObjectType(data.objectTypeId);
    }
  }, [data?.objectTypeId]);

  const handleMenuScrollToBottom = () => {
    if (!parametersData?.pageable?.last) {
      fetchParametersData({
        page: parametersData?.pageable?.page + 1,
        filters: parametersFilterFields,
      });
    }
  };

  useEffect(() => {
    if (fields?.length > 0) {
      fields.forEach((currfilter: any) => {
        if (currfilter.fieldType === 'RELATION') {
          const relationId = currfilter.field.split('.')[1];
          if (propertiesMap.current[relationId]) {
            fetchRelationObjects(
              propertiesMap.current[relationId]?.target?.urlPath,
              propertiesMap.current[relationId]?.externalId,
            );
          }
        }
      });
    }
  }, [propertiesMap.current]);

  useEffect(() => {
    fetchParametersData({ filters: parametersFilterFields });
  }, [parametersFilterFields]);

  return (fields || []).map((item: any, index: number) => {
    if (!item) return null;
    const selectedObjectProperty = propertiesMap?.current[item?.field?.split('.')?.[1]];
    const selectedParameter = allParametersData?.[item?.referencedParameterId];
    return (
      <div className="filter" key={index}>
        <div className="filter-header">
          <div>Filter {index + 1}</div>
        </div>
        <div className="filter-text">For {selectedObjectType?.displayName} filter by</div>
        <div className="upper-row">
          <FormGroup
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'objectProperty',
                  label: 'Object Property/Relations',
                  isLoading: isActiveLoading,
                  options: [
                    ...(selectedObjectType?.properties || []),
                    ...(selectedObjectType?.relations || []),
                  ]
                    .filter(
                      (objectTypeProperty) =>
                        ![InputTypes.DATE, InputTypes.DATE_TIME, InputTypes.MULTI_SELECT].includes(
                          objectTypeProperty.inputType,
                        ),
                    )
                    .map((objectTypeProperty) => ({
                      _options: objectTypeProperty?.options,
                      externalId: objectTypeProperty?.externalId,
                      label: objectTypeProperty.displayName,
                      value: objectTypeProperty.id,
                      inputType: objectTypeProperty?.inputType,
                      target: objectTypeProperty?.target,
                    })),
                  isDisabled: isReadOnly,
                  value: item?.field
                    ? [
                        {
                          label: selectedObjectProperty?.displayName,
                          value: selectedObjectProperty?.id,
                        },
                      ]
                    : null,
                  isSearchable: false,
                  placeholder: 'Select Object Property',
                  onChange: (value: any) => {
                    fields[index] = {
                      id: fields[index].id,
                      field: `searchable.${value.value}`,
                      fieldType: value?.target ? 'RELATION' : 'PROPERTY',
                    };
                    const _propertyFilters = {
                      ...data.propertyFilters,
                      fields,
                    };
                    updateFilters(_propertyFilters);

                    if (
                      [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(value?.inputType)
                    ) {
                      setState((prev) => ({
                        ...prev,
                        filterSelectOptions: {
                          ...prev.filterSelectOptions,
                          [index]: value._options,
                        },
                      }));
                    } else if (value?.target?.cardinality && value?.target?.urlPath) {
                      fetchRelationObjects(value?.target?.urlPath, value?.externalId);
                      setState((prev) => ({
                        ...prev,
                        parametersFilterFields: [
                          {
                            field: 'type',
                            op: FilterOperators.ANY,
                            values: [MandatoryParameter.RESOURCE],
                          },
                        ],
                      }));
                    } else {
                      setState((prev) => ({
                        ...prev,
                        filterSelectOptions: { ...prev.filterSelectOptions, [index]: [] },
                        parametersFilterFields: [
                          {
                            field: 'type',
                            op: FilterOperators.ANY,
                            values:
                              value.inputType === MandatoryParameter.NUMBER
                                ? [value.inputType, MandatoryParameter.CALCULATION]
                                : [value.inputType],
                          },
                        ],
                      }));
                    }
                  },
                },
              },
              ...(selectedObjectProperty?.inputType || selectedObjectProperty?.target?.cardinality
                ? [
                    {
                      type: InputTypes.SINGLE_SELECT,
                      props: {
                        id: 'objectPropertyCondition',
                        label: 'Condition is',
                        options: Object.entries(
                          labelByConstraint(
                            selectedObjectProperty?.target?.cardinality ||
                              selectedObjectProperty?.inputType,
                          ),
                        ).map(([value, label]) => ({ label, value })),
                        isSearchable: false,
                        placeholder: 'Select One',
                        isDisabled: isReadOnly,
                        value: item?.op
                          ? [
                              {
                                label: (
                                  labelByConstraint(selectedObjectProperty?.inputType) as any
                                )[item.op],
                                value: item.op,
                              },
                            ]
                          : null,
                        onChange: (value: any) => {
                          fields[index] = {
                            ...fields[index],
                            op: value.value,
                          };

                          const _propertyFilters = {
                            ...data.propertyFilters,
                            fields,
                          };
                          updateFilters(_propertyFilters);
                        },
                      },
                    },
                    ...(![InputTypes.MULTI_SELECT].includes(selectedObjectProperty?.inputType)
                      ? [
                          {
                            type: InputTypes.SINGLE_SELECT,
                            props: {
                              id: 'ValueField',
                              label: 'Select One',
                              options:
                                selectedObjectProperty?.inputType ===
                                MandatoryParameter.SINGLE_SELECT
                                  ? [
                                      {
                                        label: 'Constant',
                                        value: 'CONSTANT',
                                      },
                                    ]
                                  : [
                                      {
                                        label: 'Constant',
                                        value: 'CONSTANT',
                                      },
                                      {
                                        label: 'Parameter',
                                        value: 'PARAMETER',
                                      },
                                    ],
                              value: item?.selector
                                ? [
                                    {
                                      label: capitalize(item.selector),
                                      value: item.selector,
                                    },
                                  ]
                                : null,
                              isSearchable: false,
                              isDisabled: isReadOnly,
                              placeholder: 'Select One',
                              onChange: (value: any) => {
                                fieldKeysCorrection(index);
                                fields[index] = {
                                  ...fields[index],
                                  selector: value?.value,
                                };

                                const _propertyFilters = {
                                  ...data.propertyFilters,
                                  fields,
                                };
                                updateFilters(_propertyFilters);
                              },
                            },
                          },
                        ]
                      : []),
                    ...(item?.selector === 'CONSTANT'
                      ? selectedObjectProperty?.target?.cardinality ||
                        [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                          selectedObjectProperty?.inputType,
                        )
                        ? [
                            {
                              type: InputTypes.SINGLE_SELECT,
                              props: {
                                id: 'objectPropertyValue',
                                label: 'Value',
                                placeholder: 'Enter Value',
                                options: (
                                  (selectedObjectProperty?.target?.cardinality
                                    ? relationObjects?.[selectedObjectProperty.externalId]
                                    : filterSelectOptions?.[index]) || []
                                ).map((option) => ({
                                  ...option,
                                  label: option.displayName,
                                  value: option.id,
                                  ...(option?.externalId && {
                                    externalId: `(ID: ${option?.externalId})`,
                                  }),
                                })),
                                isSearchable: false,
                                isDisabled: isReadOnly,
                                onMenuScrollToBottom: () => {
                                  if (
                                    !pagination.current[selectedObjectProperty?.externalId]
                                      ?.isLast &&
                                    selectedObjectProperty?.target?.cardinality
                                  ) {
                                    fetchRelationObjects(
                                      selectedObjectProperty?.target?.urlPath,
                                      selectedObjectProperty?.externalId,
                                    );
                                  }
                                },
                                value: item?.displayName
                                  ? [
                                      {
                                        label: item.displayName,
                                        value: item?.values?.[0],
                                        externalId: item?.externalId,
                                      },
                                    ]
                                  : null,
                                onChange: (value: any) => {
                                  fields[index] = {
                                    ...fields[index],
                                    values: [value.value],
                                    displayName: value?.displayName,
                                    externalId: value?.externalId || '',
                                  };
                                  const _propertyFilters = {
                                    ...data.propertyFilters,
                                    fields,
                                  };
                                  updateFilters(_propertyFilters);
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
                              ].includes(selectedObjectProperty?.inputType)
                                ? InputTypes.NUMBER
                                : selectedObjectProperty?.inputType,
                              props: {
                                id: 'objectPropertyValue',
                                label: 'Value',
                                placeholder: 'Enter Value',
                                defaultValue: item?.values?.[0],
                                disabled: isReadOnly,
                                style: { width: 'calc(25% - 16px)' },
                                onChange: (value: any) => {
                                  fields[index] = {
                                    ...fields[index],
                                    values:
                                      value.value !== ''
                                        ? selectedObjectProperty?.inputType === InputTypes.NUMBER
                                          ? [parseInt(value.value)]
                                          : [value.value]
                                        : [],
                                  };

                                  const _propertyFilters = {
                                    ...data.propertyFilters,
                                    fields,
                                  };

                                  handleConstantValue(_propertyFilters);
                                },
                              },
                            },
                          ]
                      : [
                          {
                            type: InputTypes.SINGLE_SELECT,
                            props: {
                              id: 'parameter',
                              label: 'Select Parameter',
                              options: !item?.selector
                                ? []
                                : parameterOptionsList?.filter((currList) => {
                                    if (
                                      selectedObjectProperty?.target?.cardinality ===
                                        InputTypes.ONE_TO_ONE &&
                                      currList?.type === MandatoryParameter.RESOURCE &&
                                      currList?.data?.objectTypeId ===
                                        selectedObjectProperty?.objectTypeId
                                    ) {
                                      return currList;
                                    } else {
                                      return currList;
                                    }
                                  }),
                              value: item?.referencedParameterId
                                ? [
                                    {
                                      label: selectedParameter?.label,
                                      value: item.referencedParameterId,
                                    },
                                  ]
                                : null,
                              isSearchable: false,
                              isDisabled: isReadOnly,
                              placeholder: 'Select One',
                              onMenuScrollToBottom: handleMenuScrollToBottom,
                              onChange: (value: any) => {
                                fields[index] = {
                                  ...fields[index],
                                  referencedParameterId: value?.id,
                                  propertyType: value?.type,
                                };
                                const _propertyFilters = {
                                  ...data.propertyFilters,
                                  fields,
                                };
                                updateFilters(_propertyFilters);
                              },
                            },
                          },
                        ]),
                  ]
                : []),
            ]}
          />
          {!isReadOnly && !isVariationView && (
            <Close
              className="remove-icon"
              onClick={() => {
                fields?.splice(index, 1);
                const _propertyFilters = {
                  ...data.propertyFilters,
                  fields,
                };
                updateFilters(_propertyFilters);
              }}
            />
          )}
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
                    isDisabled: isReadOnly,
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
                      : null,
                    onChange: (value: any) => {
                      fields[index] = {
                        ...fields[index],
                        dateUnit: value.value,
                      };

                      const _propertyFilters = {
                        ...data.propertyFilters,
                        fields,
                      };

                      updateFilters(_propertyFilters);
                    },
                  },
                },
              ]}
            />
          )}
      </div>
    );
  });
};
export default ResourceFilter;
