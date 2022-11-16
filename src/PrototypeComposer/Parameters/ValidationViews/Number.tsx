import { Button, formatOptionLabel, FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { apiGetActivities, apiGetObjectTypes } from '#utils/apiUrls';
import { InputTypes, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { ObjectType } from '#views/Ontology/types';
import { AddCircleOutline, Close } from '@material-ui/icons';
import { keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormMethods } from 'react-hook-form';
import { labelByConstraint, ValidationWrapper } from './Resource';

type NumberValidationState = {
  isLoadingObjectType: Record<number, boolean>;
  isLoadingActivities: boolean;
  resourceActivities: any[];
  selectedObjectTypes: Record<number, ObjectType>;
};

const NumberValidation: FC<{ form: UseFormMethods<any> }> = ({ form }) => {
  const { id: checklistId } = useTypedSelector((state) => state.prototypeComposer.data!);
  const { watch, setValue, register } = form;
  const validations = watch('validations', {});
  const { resourceActivityValidations = [] } = validations;
  const [state, setState] = useState<NumberValidationState>({
    isLoadingObjectType: {},
    isLoadingActivities: true,
    resourceActivities: [],
    selectedObjectTypes: {},
  });
  const { isLoadingObjectType, resourceActivities, isLoadingActivities, selectedObjectTypes } =
    state;
  const resourceActivitiesMap = useRef<Record<string, any>>({});

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

  const fetchActivities = async () => {
    if (!resourceActivities.length) {
      setState((prev) => ({ ...prev, isLoadingActivities: true }));
      const resources = await request('GET', apiGetActivities(checklistId, 'RESOURCE'), {
        params: {
          // page: pageNumber + 1,
          // size: DEFAULT_PAGE_SIZE,
          // filters: JSON.stringify({
          //   op: FilterOperators.AND,
          //   fields: [
          //     {
          //       field: 'targetEntityType',
          //       op: FilterOperators.EQ,
          //       values: [TargetEntityType.TASK],
          //     },
          //   ],
          // }),
        },
      });
      resourceActivitiesMap.current = keyBy(resources.data || [], 'id');
      setState((prev) => ({
        ...prev,
        isLoadingActivities: false,
        resourceActivities: resources.data,
      }));
    }
  };

  useEffect(() => {
    register('validations');
    fetchActivities();
  }, []);

  useEffect(() => {
    if (resourceActivities.length) {
      const fetchedObjectTypeIds: Record<string, boolean> = {};
      resourceActivityValidations.forEach((validation: any, index: number) => {
        const objectTypeId =
          resourceActivitiesMap.current?.[validation.activityId]?.data?.objectTypeId;
        if (validation.activityId && objectTypeId) {
          if (!fetchedObjectTypeIds[objectTypeId]) {
            fetchObjectType(objectTypeId, index);
            fetchedObjectTypeIds[objectTypeId] = true;
          }
        }
      });
    }
  }, [resourceActivities]);

  const updateValidations = (updatedValidations: any) => {
    setValue(
      'validations',
      {
        ...validations,
        resourceActivityValidations: updatedValidations,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <ValidationWrapper>
      {resourceActivityValidations.map((item: any, index: number) => (
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
                    isLoading: isLoadingActivities,
                    options: resourceActivities.map((resource: any) => ({
                      ...resource.data,
                      label: resource.label,
                      value: resource.id,
                    })),
                    value: item?.activityId
                      ? [
                          {
                            label: resourceActivitiesMap.current?.[item.activityId]?.label,
                            value: item.activityId,
                          },
                        ]
                      : undefined,
                    isSearchable: false,
                    placeholder: 'Select Resource Parameter',
                    onChange: (value: any) => {
                      resourceActivityValidations[index] = {
                        ...resourceActivityValidations[index],
                        activityId: value.value,
                      };
                      updateValidations(resourceActivityValidations);
                      fetchObjectType(value.objectTypeId, index);
                    },
                  },
                },
                ...(item?.activityId
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
                            resourceActivityValidations[index] = {
                              ...resourceActivityValidations[index],
                              propertyId: value.value,
                              propertyInputType: value.inputType,
                              propertyExternalId: value.externalId,
                              propertyDisplayName: value.label,
                            };
                            updateValidations(resourceActivityValidations);
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
                            resourceActivityValidations[index] = {
                              ...resourceActivityValidations[index],
                              constraint: value.value,
                            };
                            updateValidations(resourceActivityValidations);
                          },
                        },
                      },
                    ]
                  : []),
              ]}
            />
            <Close
              className="remove-icon"
              onClick={() => {
                const updated = [...resourceActivityValidations];
                updated.splice(index, 1);
                updateValidations(updated);
              }}
            />
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
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                        resourceActivityValidations[index] = {
                          ...resourceActivityValidations[index],
                          errorMessage: e.target.value,
                        };
                        updateValidations(resourceActivityValidations);
                      },
                    },
                  },
                ]}
              />
            </>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        style={{ marginBottom: 24, padding: '6px 8px' }}
        onClick={() => {
          updateValidations([...resourceActivityValidations, {}]);
        }}
      >
        <AddCircleOutline style={{ marginRight: 8 }} /> Add
      </Button>
    </ValidationWrapper>
  );
};

export default NumberValidation;
