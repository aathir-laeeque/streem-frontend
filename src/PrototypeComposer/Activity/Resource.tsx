import { formatOptionLabel, FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { Choice, Constraint, ObjectType } from '#views/Ontology/types';
import { isArray } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateActivityApi, updateStoreActivity } from './actions';
import ActivityLabelInput from './ActivityLabelInput';
import { ActivityProps } from './types';

const ResourceWrapper = styled.div.attrs({
  className: 'activity-resource',
})`
  .form-group {
    padding: 8px 0px;
  }

  .form-group-row {
    flex-direction: row;
    gap: 16px;

    > div {
      margin: 0;
      flex: 1;
    }
  }

  .custom-select__menu {
    z-index: 2;
  }

  h3 {
    margin-block: 12px;
  }
`;

export const labelByConstraint = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
    case InputTypes.TIME:
    case InputTypes.DATE_TIME:
      return {
        [Constraint.LTE]: 'not older than',
        [Constraint.GTE]: 'not later than',
      };
    case InputTypes.SINGLE_LINE:
    case InputTypes.MULTI_LINE:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
      };
    default:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
        [Constraint.LT]: 'is less than',
        [Constraint.GT]: 'is more than',
        [Constraint.LTE]: 'is less than equal to',
        [Constraint.GTE]: 'is more than equal to',
      };
  }
};

const getDateUnits = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
      return {
        DAYS: 'Days',
      };
    default:
      return {
        HOURS: 'Hours',
        // DAYS: 'Days',
        // WEEKS: 'Weeks',
        // MONTHS: 'Months',
        // YEARS: 'Years',
      };
  }
};

const ResourceActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading },
  } = useTypedSelector((state) => state.ontology);
  const componentLoaded = useRef<boolean>(false);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [validationSelectOptions, setValidationSelectOptions] = useState<Choice[]>([]);
  const [selectedValidationOption, setSelectedValidationOption] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);
  // const [filterSelectOptions, setFilterSelectOptions] = useState<Choice[]>([]);
  // const [selectedFilterOption, setSelectedFilterOption] = useState<
  //   { label: string; value: string }[] | undefined
  // >(undefined);

  const fetchObjectType = async (id: string) => {
    setIsActiveLoading(true);
    const res = await request('GET', apiGetObjectTypes(id));
    setSelectedObjectType(res.data);
    setIsActiveLoading(false);
    if (res.data) {
      if (activity.data?.propertyValidations?.[0]?.propertyId) {
        const selectedProperty = (res.data as ObjectType)?.properties.find(
          (property) => property.id === activity.data.propertyValidations[0].propertyId,
        );
        if (selectedProperty && selectedProperty.options?.length) {
          setValidationSelectOptions(selectedProperty.options);
          if (activity.data.propertyValidations[0]?.options?.length) {
            setSelectedValidationOption(
              activity.data.propertyValidations[0].options.map(
                (option: { id: string; displayName: string }) => ({
                  label: option.displayName,
                  value: option.id,
                }),
              ),
            );
          }
        }
      }
      // if (activity.data?.propertyFilters?.[0]?.propertyId) {
      //   const selectedProperty = (res.data as ObjectType)?.properties.find(
      //     (property) => property.id === activity.data.propertyFilters[0].propertyId,
      //   );
      //   if (selectedProperty && selectedProperty.options?.length) {
      //     setFilterSelectOptions(selectedProperty.options);
      //     if (activity.data.propertyFilters[0].value) {
      //       const _selectedFilterOption = selectedProperty.options.find(
      //         (option) => option.id === activity.data.propertyFilters[0].value,
      //       );
      //       if (_selectedFilterOption)
      //         setSelectedFilterOption([
      //           {
      //             label: _selectedFilterOption?.displayName,
      //             value: _selectedFilterOption?.id,
      //           },
      //         ]);
      //     }
      //   }
      // }
    }
  };

  useEffect(() => {
    if (componentLoaded.current) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      componentLoaded.current = true;
    }
    if (activity.data?.objectTypeId && selectedObjectType?.id !== activity.data?.objectTypeId) {
      fetchObjectType(activity.data.objectTypeId);
    }
  }, [activity]);

  useEffect(() => {
    if (!list.length)
      dispatch(
        fetchObjectTypes({
          usageStatus: 1,
        }),
      );
  }, []);

  return (
    <ResourceWrapper>
      <label>Resource Activity</label>
      <ActivityLabelInput activity={activity} isControlled />
      <FormGroup
        style={{ paddingTop: 16 }}
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'objectType',
              formatOptionLabel,
              label: 'Object Type',
              isLoading: listLoading,
              options: list.map((objectType) => ({
                ...objectType,
                label: objectType.displayName,
                value: objectType.id,
              })),
              defaultValue: activity.data?.objectTypeId
                ? [
                    {
                      label: activity.data?.objectTypeDisplayName,
                      value: activity.data?.objectTypeId,
                    },
                  ]
                : undefined,
              isSearchable: false,
              placeholder: 'Select Object Type',
              onChange: (value: any) => {
                dispatch(
                  updateStoreActivity(
                    {
                      ...activity.data,
                      urlPath: `/objects/partial?collection=${value.externalId}`,
                      collection: value.externalId,
                      objectTypeId: value.id,
                      objectTypeExternalId: value.externalId,
                      objectTypeDisplayName: value.displayName,
                      propertyValidations: [],
                    },
                    activity.id,
                    ['data'],
                  ),
                );
              },
            },
          },
        ]}
      />
      {activity.data?.objectTypeId && (
        <>
          <h3>Validation</h3>
          <FormGroup
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'objectProperty',
                  formatOptionLabel,
                  label: 'Object Property',
                  isLoading: isActiveLoading,
                  options: selectedObjectType?.properties.map((objectTypeProperty) => {
                    return {
                      ...objectTypeProperty,
                      _options: [...(objectTypeProperty.options || [])],
                      options: undefined,
                      externalId: objectTypeProperty.externalId,
                      label: objectTypeProperty.displayName,
                      value: objectTypeProperty.id,
                    };
                  }),
                  value: activity.data?.propertyValidations?.[0]
                    ? [
                        {
                          label: activity.data.propertyValidations[0].propertyDisplayName,
                          value: activity.data.propertyValidations[0].propertyId,
                        },
                      ]
                    : undefined,
                  isSearchable: false,
                  placeholder: 'Select Object Property',
                  onChange: (value: any) => {
                    dispatch(
                      updateStoreActivity(
                        [
                          {
                            propertyId: value.id,
                            propertyInputType: value.inputType,
                            propertyExternalId: value.externalId,
                            propertyDisplayName: value.displayName,
                          },
                        ],
                        activity.id,
                        ['data', 'propertyValidations'],
                      ),
                    );
                    if (
                      [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(value.inputType)
                    ) {
                      setValidationSelectOptions(value._options);
                    } else {
                      setValidationSelectOptions([]);
                    }
                  },
                },
              },
            ]}
          />
          {activity.data?.propertyValidations?.[0]?.propertyInputType && (
            <>
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectPropertyCondition',
                      label: 'Condition',
                      options: Object.entries(
                        labelByConstraint(activity.data.propertyValidations[0].propertyInputType),
                      ).map(([value, label]) => ({ label, value })),
                      isSearchable: false,
                      placeholder: 'Select Condition',
                      value: activity.data?.propertyValidations?.[0]?.constraint
                        ? [
                            {
                              label: (
                                labelByConstraint(
                                  activity.data.propertyValidations[0].propertyInputType,
                                ) as any
                              )[activity.data.propertyValidations[0].constraint],
                              value: activity.data.propertyValidations[0].constraint,
                            },
                          ]
                        : undefined,
                      onChange: (value: any) => {
                        dispatch(
                          updateStoreActivity(
                            [
                              {
                                ...activity.data.propertyValidations[0],
                                constraint: value.value,
                              },
                            ],
                            activity.id,
                            ['data', 'propertyValidations'],
                          ),
                        );
                      },
                    },
                  },
                ]}
              />
              <FormGroup
                className="form-group-row"
                inputs={
                  [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                    activity.data.propertyValidations[0].propertyInputType,
                  )
                    ? [
                        {
                          type: activity.data.propertyValidations[0].propertyInputType,
                          props: {
                            id: 'objectPropertyValue',
                            label: 'Value',
                            placeholder: 'Select Property Option',
                            isSearchable: false,
                            options: validationSelectOptions.map((option) => ({
                              label: option.displayName,
                              value: option.id,
                            })),
                            value: selectedValidationOption,
                            onChange: (value: any) => {
                              setSelectedValidationOption(isArray(value) ? value : [value]);
                              dispatch(
                                updateStoreActivity(
                                  [
                                    {
                                      ...activity.data.propertyValidations[0],
                                      options: isArray(value)
                                        ? value.map((v) => ({ id: v.value, displayName: v.label }))
                                        : [
                                            {
                                              id: value.value,
                                              displayName: value.label,
                                            },
                                          ],
                                    },
                                  ],
                                  activity.id,
                                  ['data', 'propertyValidations'],
                                ),
                              );
                            },
                          },
                        },
                      ]
                    : [
                        {
                          type: [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                            activity.data.propertyValidations[0].propertyInputType,
                          )
                            ? InputTypes.NUMBER
                            : activity.data.propertyValidations[0].propertyInputType,
                          props: {
                            id: 'objectPropertyValue',
                            label: 'Value',
                            placeholder: 'Enter Value',
                            defaultValue: activity.data?.propertyValidations?.[0]?.value,
                            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                              dispatch(
                                updateStoreActivity(
                                  [
                                    {
                                      ...activity.data.propertyValidations[0],
                                      value: e.target.value,
                                    },
                                  ],
                                  activity.id,
                                  ['data', 'propertyValidations'],
                                ),
                              );
                            },
                          },
                        },
                        ...([InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                          activity.data.propertyValidations[0].propertyInputType,
                        )
                          ? [
                              {
                                type: InputTypes.SINGLE_SELECT,
                                props: {
                                  id: 'objectPropertyUnit',
                                  label: 'Unit',
                                  options: Object.entries(
                                    getDateUnits(
                                      activity.data.propertyValidations[0].propertyInputType,
                                    ),
                                  ).map(([value, label]) => ({
                                    label,
                                    value,
                                  })),
                                  isSearchable: false,
                                  placeholder: 'Select Unit',
                                  defaultValue: activity.data?.propertyValidations?.[0]?.dateUnit
                                    ? [
                                        {
                                          label: getDateUnits(
                                            activity.data.propertyValidations[0].propertyInputType,
                                          )[
                                            activity.data.propertyValidations[0]
                                              .dateUnit as keyof typeof getDateUnits
                                          ],
                                          value: activity.data.propertyValidations[0].dateUnit,
                                        },
                                      ]
                                    : undefined,
                                  onChange: (value: any) => {
                                    dispatch(
                                      updateStoreActivity(
                                        [
                                          {
                                            ...activity.data.propertyValidations[0],
                                            dateUnit: value.value,
                                          },
                                        ],
                                        activity.id,
                                        ['data', 'propertyValidations'],
                                      ),
                                    );
                                  },
                                },
                              },
                            ]
                          : []),
                      ]
                }
              />
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_LINE,
                    props: {
                      id: 'objectPropertyErrorMsg',
                      label: 'Error Message',
                      placeholder: 'Enter Error Message',
                      defaultValue: activity.data?.propertyValidations?.[0]?.errorMessage,
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                        dispatch(
                          updateStoreActivity(
                            [
                              {
                                ...activity.data.propertyValidations[0],
                                errorMessage: e.target.value,
                              },
                            ],
                            activity.id,
                            ['data', 'propertyValidations'],
                          ),
                        );
                      },
                    },
                  },
                ]}
              />
            </>
          )}
          {/* <h3>Filters</h3>
          <FormGroup
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'objectProperty',
                  formatOptionLabel,
                  label: 'Object Property',
                  isLoading: isActiveLoading,
                  options: selectedObjectType?.properties.map((objectTypeProperty) => {
                    return {
                      ...objectTypeProperty,
                      _options: [...(objectTypeProperty.options || [])],
                      options: undefined,
                      externalId: objectTypeProperty.externalId,
                      label: objectTypeProperty.displayName,
                      value: objectTypeProperty.id,
                    };
                  }),
                  value: activity.data?.propertyFilters?.[0]
                    ? [
                        {
                          label: activity.data.propertyFilters[0].propertyDisplayName,
                          value: activity.data.propertyFilters[0].propertyId,
                        },
                      ]
                    : undefined,
                  isSearchable: false,
                  placeholder: 'Select Object Property',
                  onChange: (value: any) => {
                    dispatch(
                      updateStoreActivity(
                        [
                          {
                            propertyId: value.id,
                            propertyInputType: value.inputType,
                            propertyExternalId: value.externalId,
                            propertyDisplayName: value.displayName,
                          },
                        ],
                        activity.id,
                        ['data', 'propertyFilters'],
                      ),
                    );
                    if (
                      [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(value.inputType)
                    ) {
                      setFilterSelectOptions(value._options);
                    } else {
                      setFilterSelectOptions([]);
                    }
                  },
                },
              },
            ]}
          />
          {activity.data?.propertyFilters?.[0]?.propertyInputType && (
            <>
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectPropertyCondition',
                      label: 'Condition',
                      options: Object.entries(
                        labelByConstraint(activity.data.propertyFilters[0].propertyInputType),
                      ).map(([value, label]) => ({ label, value })),
                      isSearchable: false,
                      placeholder: 'Select Condition',
                      value: activity.data?.propertyFilters?.[0]?.constraint
                        ? [
                            {
                              label: (
                                labelByConstraint(
                                  activity.data.propertyFilters[0].propertyInputType,
                                ) as any
                              )[activity.data.propertyFilters[0].constraint],
                              value: activity.data.propertyFilters[0].constraint,
                            },
                          ]
                        : undefined,
                      onChange: (value: any) => {
                        dispatch(
                          updateStoreActivity(
                            [
                              {
                                ...activity.data.propertyFilters[0],
                                constraint: value.value,
                              },
                            ],
                            activity.id,
                            ['data', 'propertyFilters'],
                          ),
                        );
                      },
                    },
                  },
                ]}
              />
              <FormGroup
                className="form-group-row"
                inputs={
                  [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                    activity.data.propertyFilters[0].propertyInputType,
                  )
                    ? [
                        {
                          type: activity.data.propertyFilters[0].propertyInputType,
                          props: {
                            id: 'objectPropertyValue',
                            label: 'Value',
                            placeholder: 'Select Property Option',
                            isSearchable: false,
                            options: filterSelectOptions.map((option) => ({
                              label: option.displayName,
                              value: option.id,
                            })),
                            value: selectedFilterOption,
                            onChange: (value: any) => {
                              setSelectedFilterOption([value]);
                              dispatch(
                                updateStoreActivity(
                                  [
                                    {
                                      ...activity.data.propertyFilters[0],
                                      value: value.value,
                                    },
                                  ],
                                  activity.id,
                                  ['data', 'propertyFilters'],
                                ),
                              );
                            },
                          },
                        },
                      ]
                    : [
                        {
                          type: InputTypes.NUMBER,
                          props: {
                            id: 'objectPropertyValue',
                            label: 'Value',
                            placeholder: 'Enter Value',
                            defaultValue: activity.data?.propertyFilters?.[0]?.value,
                            onChange: ({ value }: { name: string; value: string }) => {
                              dispatch(
                                updateStoreActivity(
                                  [
                                    {
                                      ...activity.data.propertyFilters[0],
                                      value: value,
                                    },
                                  ],
                                  activity.id,
                                  ['data', 'propertyFilters'],
                                ),
                              );
                            },
                          },
                        },
                        ...([InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                          activity.data.propertyFilters[0].propertyInputType,
                        )
                          ? [
                              {
                                type: InputTypes.SINGLE_SELECT,
                                props: {
                                  id: 'objectPropertyUnit',
                                  label: 'Unit',
                                  options: Object.entries(dateUnits).map(([value, label]) => ({
                                    label,
                                    value,
                                  })),
                                  isSearchable: false,
                                  placeholder: 'Select Unit',
                                  defaultValue: activity.data?.propertyFilters?.[0]?.dateUnit
                                    ? [
                                        {
                                          label:
                                            dateUnits[
                                              activity.data.propertyFilters[0]
                                                .dateUnit as keyof typeof dateUnits
                                            ],
                                          value: activity.data.propertyFilters[0].dateUnit,
                                        },
                                      ]
                                    : undefined,
                                  onChange: (value: any) => {
                                    dispatch(
                                      updateStoreActivity(
                                        [
                                          {
                                            ...activity.data.propertyFilters[0],
                                            dateUnit: value.value,
                                          },
                                        ],
                                        activity.id,
                                        ['data', 'propertyFilters'],
                                      ),
                                    );
                                  },
                                },
                              },
                            ]
                          : []),
                      ]
                }
              />
            </>
          )} */}
        </>
      )}
    </ResourceWrapper>
  );
};

export default ResourceActivity;
