import { Button, FormGroup } from '#components';
import { labelByConstraint } from '#utils';
import { apiGetObjectTypes } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Choice, Constraint, ObjectType } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { isArray, keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

export const ValidationWrapper = styled.div`
  .validation {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 24px;
    padding-bottom: 8px;
    :last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }

    .validation-header {
      background-color: #f4f4f4;
      padding: 12px;
      > div {
        font-size: 14px;
        font-weight: 700;
      }
    }

    .validation-text {
      font-size: 14px;
      font-weight: 400;
    }

    .upper-row {
      display: flex;
      align-items: center;
      gap: 16px;
      .remove-icon {
        cursor: pointer;
        margin-top: 6px;
        font-size: 16px;
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

    textarea {
      padding: 10px;
    }
  }

  .custom-select__menu {
    z-index: 2;
  }
`;

export const getDateUnits = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
      return {
        DAYS: 'Days from today',
      };
    default:
      return {
        HOURS: 'Hours from now',
        // DAYS: 'Days',
        // WEEKS: 'Weeks',
        // MONTHS: 'Months',
        // YEARS: 'Years',
      };
  }
};

type ResourceValidationState = {
  isActiveLoading: boolean;
  validationSelectOptions: Record<number, Choice[]>;
  selectedObjectType?: ObjectType;
};

const ResourceValidation: FC<{
  form: UseFormMethods<any>;
  isReadOnly: boolean;
  isVariationView?: boolean;
}> = ({ form, isReadOnly, isVariationView = false }) => {
  const { watch, setValue, setError, clearErrors } = form;
  const data = watch('data', {
    propertyValidations: [],
  });
  const [state, setState] = useState<ResourceValidationState>({
    isActiveLoading: true,
    validationSelectOptions: {},
  });
  const { propertyValidations = [] } = data;
  const { isActiveLoading, selectedObjectType, validationSelectOptions } = state;
  const propertiesMap = useRef<Record<string, any>>({});

  const fetchObjectType = async (id: string) => {
    setState((prev) => ({ ...prev, isActiveLoading: true }));
    const res: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
    if (res.data) {
      propertiesMap.current = keyBy(res.data.properties || [], 'id');
      updateValidationOptions(propertyValidations);
    }
    setState((prev) => ({ ...prev, isActiveLoading: false, selectedObjectType: res.data }));
  };

  const updateValidationOptions = (validation: any[]) => {
    const updatedOptions: Record<number, Choice[]> = {};
    validation.forEach((validation: any, index: number) => {
      if (validation) {
        updatedOptions[index] = propertiesMap.current?.[validation.propertyId]?.options || [];
      }
    });
    setState((prev) => ({ ...prev, validationSelectOptions: updatedOptions }));
  };

  useEffect(() => {
    if (data?.objectTypeId) {
      fetchObjectType(data.objectTypeId);
    }
  }, [data?.objectTypeId]);

  const updateValidations = (updatedValidations: any[]) => {
    let isValid = true;
    updatedValidations.every((validation: any) => {
      if (!validation) return true;
      const keyToValidate = [
        'propertyId',
        'propertyInputType',
        'propertyExternalId',
        'propertyDisplayName',
        'constraint',
        [InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
          validation.propertyInputType,
        )
          ? 'dateUnit'
          : [InputTypes.SINGLE_SELECT, InputTypes.MULTI_SELECT].includes(
              validation.propertyInputType,
            )
          ? 'options'
          : 'value',
        'errorMessage',
      ];
      keyToValidate.every((key) => {
        const checkSingleProperty = !!validation?.[key]?.length;
        if (!checkSingleProperty) {
          isValid = false;
        }
        return isValid;
      });
      return isValid;
    });
    setValue(
      'data',
      {
        ...data,
        propertyValidations: updatedValidations,
      },
      {
        shouldDirty: true,
      },
    );
    if (!isValid) {
      setError('data', {
        message: 'All Validation Options Should be Filled.',
      });
    } else {
      clearErrors('data');
    }
  };

  return (
    <ValidationWrapper>
      {(propertyValidations || []).map((item: any, index: number) => {
        if (!item) return null;
        return (
          <div className="validation" key={index}>
            <div className="validation-header">
              <div>Validation {index + 1}</div>
            </div>
            <div className="validation-text">Check if</div>
            <div className="upper-row">
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectProperty',
                      label: 'Object Property is',
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
                      isDisabled: isReadOnly,
                      placeholder: 'Select Object Property',
                      onChange: (value: any) => {
                        propertyValidations[index] = {
                          id: propertyValidations[index]?.id,
                          propertyId: value.value,
                          propertyInputType: value.inputType,
                          propertyExternalId: value.externalId,
                          propertyDisplayName: value.label,
                        };
                        updateValidations(propertyValidations);
                        if (
                          [InputTypes.MULTI_SELECT, InputTypes.SINGLE_SELECT].includes(
                            value.inputType,
                          )
                        ) {
                          setState((prev) => ({
                            ...prev,
                            validationSelectOptions: {
                              ...prev.validationSelectOptions,
                              [index]: value._options,
                            },
                          }));
                        } else {
                          setState((prev) => ({
                            ...prev,
                            validationSelectOptions: {
                              ...prev.validationSelectOptions,
                              [index]: [],
                            },
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
                            label: 'Condition is',
                            options: Object.entries(labelByConstraint(item.propertyInputType)).map(
                              ([value, label]) => ({ label, value }),
                            ),
                            isSearchable: false,
                            placeholder: 'Select Condition',
                            isDisabled: isReadOnly,
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
                              propertyValidations[index] = {
                                ...propertyValidations[index],
                                constraint: value.value,
                              };
                              updateValidations(propertyValidations);
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
                                  label: 'Value is',
                                  placeholder: 'Select Property Option',
                                  isSearchable: false,
                                  options: (validationSelectOptions?.[index] || []).map(
                                    (option) => ({
                                      label: option.displayName,
                                      value: option.id,
                                    }),
                                  ),
                                  isDisabled: isReadOnly,
                                  value: (item?.options || []).map((option: any) => ({
                                    label: option.displayName,
                                    value: option.id,
                                  })),
                                  onChange: (value: any) => {
                                    propertyValidations[index] = {
                                      ...propertyValidations[index],
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
                                    updateValidations(propertyValidations);
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
                                  label: 'Value is',
                                  disabled: isReadOnly,
                                  placeholder: 'Enter Value',
                                  defaultValue: item?.value,
                                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                    propertyValidations[index] = {
                                      ...propertyValidations[index],
                                      value: e.target.value,
                                    };
                                    updateValidations(propertyValidations);
                                  },
                                },
                              },
                            ]),
                        ...([InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(
                          item.propertyInputType,
                        )
                          ? [
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
                                  isDisabled: isReadOnly,
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
                                    propertyValidations[index] = {
                                      ...propertyValidations[index],
                                      dateUnit: value.value,
                                    };
                                    updateValidations(propertyValidations);
                                  },
                                },
                              },
                            ]
                          : []),
                      ]
                    : []),
                ]}
              />
              {!isReadOnly && !isVariationView && (
                <Close
                  className="remove-icon"
                  onClick={() => {
                    propertyValidations?.splice(index, 1);
                    updateValidations(propertyValidations);
                    updateValidationOptions(propertyValidations);
                  }}
                />
              )}
            </div>
            {item?.propertyInputType && (
              <>
                <div className="validation-text">
                  If the condition is breached display an error message
                </div>
                <FormGroup
                  inputs={[
                    {
                      type: InputTypes.SINGLE_LINE,
                      props: {
                        id: 'objectPropertyErrorMsg',
                        label: 'Error Message',
                        placeholder: 'Enter Error Message',
                        description:
                          'This message will be displayed when the validation rule is breached',
                        defaultValue: item?.errorMessage,
                        disabled: isReadOnly,
                        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                          propertyValidations[index] = {
                            ...propertyValidations[index],
                            errorMessage: e.target.value,
                          };
                          updateValidations(propertyValidations);
                        },
                      },
                    },
                  ]}
                />
              </>
            )}
          </div>
        );
      })}
      {!isReadOnly && !isVariationView && (
        <Button
          type="button"
          variant="secondary"
          style={{ marginBottom: 24, padding: '6px 8px' }}
          onClick={() => {
            propertyValidations[propertyValidations.length] = {
              key: uuidv4(),
              id: uuidv4(),
            };
            updateValidations(propertyValidations);
          }}
        >
          <AddCircleOutline style={{ marginRight: 8 }} /> Add
        </Button>
      )}
    </ValidationWrapper>
  );
};

export default ResourceValidation;
