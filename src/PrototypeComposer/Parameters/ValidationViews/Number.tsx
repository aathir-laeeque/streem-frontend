import { Button, formatOptionLabel, FormGroup } from '#components';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetParameters, apiGetObjectTypes } from '#utils/apiUrls';
import { FilterOperators, InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { ObjectType } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { labelByConstraint, ValidationWrapper } from './Resource';

type NumberValidationState = {
  isLoadingObjectType: Record<number, boolean>;
  isLoadingParameters: boolean;
  resourceParameters: any[];
  selectedObjectTypes: Record<number, ObjectType>;
};

const keyToValidate = [
  'parameterId',
  'propertyId',
  'propertyInputType',
  'propertyExternalId',
  'propertyDisplayName',
  'constraint',
  'errorMessage',
];

const NumberValidation: FC<{ form: UseFormMethods<any>; isReadOnly: boolean }> = ({
  form,
  isReadOnly,
}) => {
  const { id: checklistId } = useTypedSelector((state) => state.prototypeComposer.data!);
  const { watch, setValue, register, setError, clearErrors } = form;
  const validations = watch('validations', {});
  const { resourceParameterValidations = [] } = validations;
  const [state, setState] = useState<NumberValidationState>({
    isLoadingObjectType: {},
    isLoadingParameters: true,
    resourceParameters: [],
    selectedObjectTypes: {},
  });
  const { isLoadingObjectType, resourceParameters, isLoadingParameters, selectedObjectTypes } =
    state;
  const resourceParametersMap = useRef<Record<string, any>>({});

  const fetchObjectType = async (id: string, index: number) => {
    let result = Object.values(selectedObjectTypes).find((objectType) => {
      return id === objectType.id;
    });
    if (!result) {
      setState((prev) => ({
        ...prev,
        isLoadingObjectType: {
          ...prev.isLoadingObjectType,
          [index]: true,
        },
      }));
      const res: ResponseObj<ObjectType> = await request('GET', apiGetObjectTypes(id));
      result = res.data;
    }
    setState((prev) => ({
      ...prev,
      isLoadingObjectType: {
        ...prev.isLoadingObjectType,
        [index]: false,
      },
      selectedObjectTypes: {
        ...prev.selectedObjectTypes,
        [index]: result!,
      },
    }));
  };

  const fetchParameters = async () => {
    if (!resourceParameters.length) {
      setState((prev) => ({ ...prev, isLoadingParameters: true }));
      const resources = await request('GET', apiGetParameters(checklistId), {
        params: {
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
              {
                field: 'type',
                op: FilterOperators.EQ,
                values: [MandatoryParameter.RESOURCE],
              },
            ],
          }),
        },
      });
      resourceParametersMap.current = keyBy(resources.data || [], 'id');
      setState((prev) => ({
        ...prev,
        isLoadingParameters: false,
        resourceParameters: resources.data,
      }));
    }
  };

  useEffect(() => {
    register('validations');
    fetchParameters();
  }, []);

  useEffect(() => {
    if (resourceParameters.length) {
      const fetchedObjectTypeIds: Record<string, boolean> = {};
      resourceParameterValidations.forEach((validation: any, index: number) => {
        const objectTypeId =
          resourceParametersMap.current?.[validation.parameterId]?.data?.objectTypeId;
        if (validation.parameterId && objectTypeId) {
          if (!fetchedObjectTypeIds[objectTypeId]) {
            fetchObjectType(objectTypeId, index);
            fetchedObjectTypeIds[objectTypeId] = true;
          }
        }
      });
    }
  }, [resourceParameters]);

  const updateValidations = (updatedValidations: any[]) => {
    let isValid = true;
    updatedValidations.every((validation: any) => {
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
      'validations',
      {
        ...validations,
        resourceParameterValidations: updatedValidations,
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
      {resourceParameterValidations.map((item: any, index: number) => (
        <div className="validation" key={index}>
          <div className="upper-row">
            <FormGroup
              inputs={[
                {
                  type: InputTypes.SINGLE_SELECT,
                  props: {
                    id: 'objectType',
                    formatOptionLabel,
                    label: 'Resource Parameter',
                    isLoading: isLoadingParameters,
                    options: resourceParameters.map((resource: any) => ({
                      ...resource.data,
                      label: resource.label,
                      value: resource.id,
                    })),
                    isDisabled: isReadOnly,
                    value: item?.parameterId
                      ? [
                          {
                            label: resourceParametersMap.current?.[item.parameterId]?.label,
                            value: item.parameterId,
                          },
                        ]
                      : undefined,
                    isSearchable: false,
                    placeholder: 'Select Resource Parameter',
                    onChange: (value: any) => {
                      resourceParameterValidations[index] = {
                        ...resourceParameterValidations[index],
                        parameterId: value.value,
                      };
                      updateValidations(resourceParameterValidations);
                      fetchObjectType(value.objectTypeId, index);
                    },
                  },
                },
                ...(item?.parameterId
                  ? [
                      {
                        type: InputTypes.SINGLE_SELECT,
                        props: {
                          id: 'objectProperty',
                          formatOptionLabel,
                          label: 'Object Property',
                          isLoading: isLoadingObjectType?.[index],
                          options: (selectedObjectTypes?.[index]?.properties || []).reduce<
                            Array<Record<string, string>>
                          >((acc, objectTypeProperty) => {
                            if (objectTypeProperty.inputType === InputTypes.NUMBER) {
                              acc.push({
                                inputType: objectTypeProperty.inputType,
                                externalId: objectTypeProperty.externalId,
                                label: objectTypeProperty.displayName,
                                value: objectTypeProperty.id,
                              });
                            }
                            return acc;
                          }, []),
                          isSearchable: false,
                          isDisabled: isReadOnly,
                          placeholder: 'Select Object Property',
                          value: item?.propertyId
                            ? [
                                {
                                  label: item.propertyDisplayName,
                                  value: item.propertyId,
                                },
                              ]
                            : undefined,
                          onChange: (value: any) => {
                            resourceParameterValidations[index] = {
                              ...resourceParameterValidations[index],
                              propertyId: value.value,
                              propertyInputType: value.inputType,
                              propertyExternalId: value.externalId,
                              propertyDisplayName: value.label,
                            };
                            updateValidations(resourceParameterValidations);
                          },
                        },
                      },
                    ]
                  : []),
                ...(item?.propertyId
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
                          isDisabled: isReadOnly,
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
                            resourceParameterValidations[index] = {
                              ...resourceParameterValidations[index],
                              constraint: value.value,
                            };
                            updateValidations(resourceParameterValidations);
                          },
                        },
                      },
                    ]
                  : []),
              ]}
            />
            {!isReadOnly && (
              <Close
                className="remove-icon"
                onClick={() => {
                  const updated = [...resourceParameterValidations];
                  updated.splice(index, 1);
                  updateValidations(updated);
                }}
              />
            )}
          </div>
          {item?.propertyInputType && (
            <>
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
                        resourceParameterValidations[index] = {
                          ...resourceParameterValidations[index],
                          errorMessage: e.target.value,
                        };
                        updateValidations(resourceParameterValidations);
                      },
                    },
                  },
                ]}
              />
            </>
          )}
        </div>
      ))}
      {!isReadOnly && (
        <Button
          type="button"
          variant="secondary"
          style={{ marginBottom: 24, padding: '6px 8px' }}
          onClick={() => {
            updateValidations([...resourceParameterValidations, {}]);
          }}
        >
          <AddCircleOutline style={{ marginRight: 8 }} /> Add
        </Button>
      )}
    </ValidationWrapper>
  );
};

export default NumberValidation;
