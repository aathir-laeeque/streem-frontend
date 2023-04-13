import { BaseModal, Button, FormGroup } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import {
  AutomationActionActionType,
  AutomationActionDetails,
  AutomationActionTriggerType,
  AutomationActionType,
  AutomationTargetEntityType,
} from '#JobComposer/checklist.types';
import { MandatoryParameter, TargetEntityType } from '#PrototypeComposer/checklist.types';
import {
  addTaskAction,
  archiveTaskAction,
  updateTaskAction,
} from '#PrototypeComposer/Tasks/actions';
import { Task } from '#PrototypeComposer/Tasks/types';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters } from '#utils/apiUrls';
import { FilterOperators, InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { ObjectType } from '#views/Ontology/types';
import { startCase, toLower } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AddCircleOutline } from '@material-ui/icons';

const Wrapper = styled.div`
  .modal {
    min-width: 40vw !important;

    &-body {
      padding: 0 !important;
      overflow: auto;
    }
  }

  .body {
    display: flex;
    flex-direction: column;

    .fields {
      min-height: 250px;
    }

    .inline-fields {
      .form-group {
        flex: 1;
        flex-direction: row;
        padding-block: 0px;
        gap: 16px;

        > div {
          flex: 1;
          .input-wrapper {
            flex: unset;
          }
        }
      }
    }

    .buttons-container {
      display: flex;
      padding: 0 16px 16px;
    }
  }
`;

const getDateUnits = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
      return {
        DAYS: 'Days',
        MONTHS: 'Months',
        YEARS: 'Years',
      };
    default:
      return {
        HOURS: 'Hours',
        MINUTES: 'Minutes',
        SECONDS: 'Seconds',
      };
  }
};

const commonKeys = [
  'propertyId',
  'propertyInputType',
  'propertyExternalId',
  'propertyDisplayName',
  'referencedParameterId',
];

type Props = {
  task: Task;
  checklistId: string;
};

const ConfigureActions: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { task, checklistId },
}) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading },
  } = useTypedSelector((state) => state.ontology);
  const {
    data,
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [resourceParameters, setResourceParameters] = useState<any>([]);
  const [numberParameters, setNumberParameters] = useState<any>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>();
  const form = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: task.automations.length
      ? {
          actionType: task.automations[0].actionType,
          actionDetails: task.automations[0].actionDetails,
        }
      : undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    getValues,
    watch,
    control,
  } = form;

  useEffect(() => {
    if (task.automations.length) {
      fetchParameters();
    }
  }, []);

  const actionType = watch('actionType');
  const actionDetails = watch('actionDetails');

  useEffect(() => {
    console.log({
      actionType,
      actionDetails,
    });
  }, [actionType, actionDetails]);

  const onSubmit = (data: {
    actionType: AutomationActionActionType;
    actionDetails: AutomationActionDetails;
  }) => {
    const commonData = {
      type: AutomationActionType.PROCESS_BASED,
      orderTree: 1,
      triggerType: AutomationActionTriggerType.TASK_COMPLETED,
      targetEntityType:
        data.actionType === AutomationActionActionType.CREATE_OBJECT
          ? AutomationTargetEntityType.OBJECT
          : AutomationTargetEntityType.RESOURCE_PARAMETER,
      triggerDetails: {},
    };
    let _actionDetails = data.actionDetails;
    if (
      ![
        AutomationActionActionType.CREATE_OBJECT,
        AutomationActionActionType.ARCHIVE_OBJECT,
      ].includes(data.actionType)
    ) {
      let keysToValidate: string[] = [];
      if (data.actionType === AutomationActionActionType.SET_PROPERTY) {
        if (_actionDetails?.propertyInputType) {
          if ([InputTypes.DATE, InputTypes.DATE_TIME].includes(_actionDetails.propertyInputType)) {
            keysToValidate = ['entityType', 'entityId', 'captureProperty', 'dateUnit', 'value'];
          } else {
            keysToValidate = ['choices'];
          }
        }
      } else {
        keysToValidate = ['parameterId'];
      }
      _actionDetails = [...commonKeys, ...keysToValidate].reduce<any>((acc, k) => {
        acc[k] = (data.actionDetails as unknown as any)?.[k];
        return acc;
      }, {});
    }
    if (task.automations.length) {
      dispatch(
        updateTaskAction({
          actionId: task.automations[0].id,
          taskId: task.id,
          action: {
            actionType: data.actionType,
            actionDetails: _actionDetails,
            ...commonData,
          },
        }),
      );
    } else {
      dispatch(
        addTaskAction({
          taskId: task.id,
          action: {
            actionType: data.actionType,
            actionDetails: _actionDetails,
            ...commonData,
          },
        }),
      );
    }
  };

  const getParameterByType = (type: MandatoryParameter) =>
    request('GET', apiGetParameters(checklistId), {
      params: {
        filters: {
          op: FilterOperators.AND,
          fields: [
            { field: 'archived', op: FilterOperators.EQ, values: [false] },
            {
              field: 'type',
              op: FilterOperators.EQ,
              values: [type],
            },
            {
              field: 'targetEntityType',
              op: FilterOperators.NE,
              values: [TargetEntityType.UNMAPPED],
            },
          ],
        },
      },
    });

  const fetchParameters = async () => {
    if (!resourceParameters.length && !numberParameters.length) {
      setIsLoadingParameters(true);
      const [resources, numbers] = await Promise.all([
        getParameterByType(MandatoryParameter.RESOURCE),
        getParameterByType(MandatoryParameter.NUMBER),
      ]);
      if (
        task.automations.length &&
        ![
          AutomationActionActionType.CREATE_OBJECT,
          AutomationActionActionType.ARCHIVE_OBJECT,
        ].includes(task.automations[0].actionType)
      ) {
        const _selectedResource = resources.data.find(
          (r: any) => r.id === task.automations[0]?.actionDetails?.referencedParameterId,
        );
        if (_selectedResource) {
          fetchObjectType(_selectedResource.data.objectTypeId);
        }
      }
      setResourceParameters(resources.data);
      setNumberParameters(numbers.data);
      setIsLoadingParameters(false);
    }
  };

  const fetchObjectType = async (id: string) => {
    setSelectedObjectType(undefined);
    setIsLoadingObjectType(true);
    const res = await request('GET', apiGetObjectTypes(id));
    setSelectedObjectType(res.data);
    if (actionType === AutomationActionActionType.SET_PROPERTY && actionDetails?.propertyId) {
      const _selectedProperty = (res.data?.properties || []).find(
        (property: any) => actionDetails?.propertyId === property.id,
      );
      if (_selectedProperty) {
        setSelectedProperty({
          ..._selectedProperty,
          _options: _selectedProperty.options,
        });
      }
    }
    setIsLoadingObjectType(false);
  };

  const archiveAction = () => {
    dispatch(
      archiveTaskAction({
        taskId: task.id,
        actionId: task.automations[0].id,
      }),
    );
  };

  // register('actionType', {
  //   required: true,
  // });

  // register('actionDetails', {
  //   required: true,
  //   validate: {
  //     isValid: (v) => {
  //       console.log('zero not valid', v, actionType);
  //       if (actionType) {
  //         if (actionType !== AutomationActionActionType.CREATE_OBJECT) {
  //           let keysToValidate: string[] = [];
  //           if (actionType === AutomationActionActionType.SET_PROPERTY) {
  //             if (v?.propertyInputType) {
  //               if ([InputTypes.DATE, InputTypes.DATE_TIME].includes(v.propertyInputType)) {
  //                 keysToValidate = [
  //                   'entityType',
  //                   'entityId',
  //                   'captureProperty',
  //                   'dateUnit',
  //                   'value',
  //                 ];
  //               } else {
  //                 keysToValidate = ['choices'];
  //               }
  //             }
  //           } else {
  //             keysToValidate = ['parameterId'];
  //           }

  //           return [...commonKeys, ...keysToValidate].every((key) => !!v?.[key]);
  //         }
  //         return true;
  //       }
  //       return false;
  //     },
  //   },
  // });

  // test

  const [count, setCount] = useState([1]);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Configure Actions"
        showFooter={false}
      >
        <div className="body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {count.map((item, index) => (
              <ActionsCard
                key={index}
                item={item}
                index={index}
                form={form}
                fetchObjectType={fetchObjectType}
                resourceParameters={resourceParameters}
                fetchParameters={fetchParameters}
                list={list}
                listLoading={listLoading}
                isLoadingParameters={isLoadingParameters}
                numberParameters={numberParameters}
                isLoadingObjectType={isLoadingObjectType}
                selectedObjectType={selectedObjectType}
                selectedProperty={selectedProperty}
                setSelectedProperty={setSelectedProperty}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              style={{
                padding: '6px 8px',
                display: 'flex',
                marginInline: 'auto',
                marginBottom: 16,
                width: '75%',
              }}
              onClick={() => {
                setCount((prev) => [...prev, 1]);
              }}
            >
              <AddCircleOutline style={{ marginRight: 8 }} /> Add
            </Button>
            <div className="buttons-container">
              <Button variant="secondary" color="red" onClick={closeOverlay}>
                Cancel
              </Button>
              <Button disabled={!isDirty || !isValid} type="submit">
                Confirm
              </Button>
              {task.automations.length > 0 && (
                <Button
                  variant="primary"
                  color="red"
                  onClick={archiveAction}
                  style={{ marginLeft: 'auto' }}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

const ActionsCard = ({
  item,
  index,
  form,
  resourceParameters,
  fetchParameters,
  list,
  listLoading,
  isLoadingParameters,
  fetchObjectType,
  numberParameters,
  isLoadingObjectType,
  selectedObjectType,
  selectedProperty,
  setSelectedProperty,
}) => {
  const dispatch = useDispatch();
  const {
    data,
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const { setValue, register, getValues, watch } = form;

  const actionType = watch('actionType');
  const actionDetails = watch('actionDetails');

  const getSetAsOptions = () => {
    return [
      // {
      //   label: 'Job Start time',
      //   value: {
      //     entityType: 'JOB',
      //     entityId: data?.id,
      //     captureProperty: 'START_TIME',
      //   },
      // },
      // {
      //   label: 'Job End time',
      //   value: {
      //     entityType: 'JOB',
      //     entityId: data?.id,
      //     captureProperty: 'END_TIME',
      //   },
      // },
      // {
      //   label: 'Task Start time',
      //   value: {
      //     entityType: 'TASK',
      //     entityId: activeTaskId,
      //     captureProperty: 'START_TIME',
      //   },
      // },
      {
        label: 'Task End time',
        value: {
          entityType: 'TASK',
          entityId: activeTaskId,
          captureProperty: 'END_TIME',
        },
      },
    ];
  };

  register(`actionType.${index}`, {
    required: true,
  });

  register(`actionDetails.${index}`, {
    required: true,
    validate: {
      isValid: (v) => {
        if (actionType?.length) {
          if (actionType[index] !== AutomationActionActionType.CREATE_OBJECT) {
            let keysToValidate: string[] = [];
            if (actionType[index] === AutomationActionActionType.SET_PROPERTY) {
              if (v?.propertyInputType) {
                if ([InputTypes.DATE, InputTypes.DATE_TIME].includes(v.propertyInputType)) {
                  keysToValidate = [
                    'entityType',
                    'entityId',
                    'captureProperty',
                    'dateUnit',
                    'value',
                  ];
                } else {
                  keysToValidate = ['choices'];
                }
              }
            } else {
              keysToValidate = ['parameterId'];
            }
            return [...commonKeys, ...keysToValidate].every((key) => !!v?.[key]);
          }
          return true;
        }
        return false;
      },
    },
  });

  console.log('zero action card', form, getValues(), { selectedObjectType, selectedProperty });

  return (
    <div className="fields">
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'actionType',
              label: 'Action Type',
              options: Object?.keys(AutomationActionActionType)?.map((actionType) => ({
                label: startCase(toLower(actionType)),
                value: actionType,
              })),
              isSearchable: false,
              placeholder: 'Select Action Type',
              value:
                actionType?.length && actionType?.[index] !== undefined
                  ? [
                      {
                        label: startCase(toLower(actionType?.[index])),
                        value: actionType?.[index],
                      },
                    ]
                  : undefined,
              onChange: (_option: { value: string }) => {
                setValue(
                  `actionDetails.${index}`,
                  {},
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
                setValue(`actionType.${index}`, _option.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                if (_option.value === AutomationActionActionType.CREATE_OBJECT && !list.length) {
                  dispatch(
                    fetchObjectTypes({
                      usageStatus: 1,
                    }),
                  );
                } else if (!resourceParameters.length) {
                  fetchParameters();
                }
              },
            },
          },
          ...(actionType?.length && actionType?.[index] !== undefined
            ? [
                ...(actionType?.[index] === AutomationActionActionType.CREATE_OBJECT
                  ? [
                      {
                        type: InputTypes.SINGLE_SELECT,
                        props: {
                          id: 'actionDetails',
                          label: 'Object Type',
                          isLoading: listLoading,
                          options: list?.map((objectType) => ({
                            ...objectType,
                            label: objectType.displayName,
                            value: objectType.id,
                          })),
                          value: actionDetails?.[index]?.objectTypeId
                            ? [
                                {
                                  label: actionDetails[index].objectTypeDisplayName,
                                  value: actionDetails[index].objectTypeId,
                                },
                              ]
                            : undefined,
                          isSearchable: false,
                          placeholder: 'Select Object Type',
                          onChange: (_option: any) => {
                            setValue(
                              `actionDetails.${index}`,
                              {
                                urlPath: `/objects/partial?collection=${_option.externalId}`,
                                collection: _option.externalId,
                                objectTypeId: _option.id,
                                objectTypeExternalId: _option.externalId,
                                objectTypeDisplayName: _option.displayName,
                              },
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                          },
                        },
                      },
                    ]
                  : [
                      {
                        type: InputTypes.SINGLE_SELECT,
                        props: {
                          id: 'objectType',
                          label: 'Resource Parameter',
                          isLoading: isLoadingParameters,
                          options: resourceParameters?.map((resource: any) => ({
                            ...resource.data,
                            label: resource.label,
                            value: resource.id,
                          })),
                          value: actionDetails?.[index]?.referencedParameterId
                            ? [
                                {
                                  label: resourceParameters.find(
                                    (resource: any) =>
                                      resource.id === actionDetails[index].referencedParameterId,
                                  )?.label,
                                  value: actionDetails[index].referencedParameterId,
                                },
                              ]
                            : null,
                          isSearchable: false,
                          placeholder: 'Select Resource Parameter',
                          onChange: (_option: any) => {
                            setValue(
                              `actionDetails.${index}`,
                              {
                                referencedParameterId: _option.value,
                                parameterId: actionDetails[index]?.parameterId,
                              },
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                            fetchObjectType(_option.objectTypeId);
                          },
                        },
                      },
                      ...(actionType?.[index] === AutomationActionActionType.SET_PROPERTY
                        ? []
                        : [
                            {
                              type: InputTypes.SINGLE_SELECT,
                              props: {
                                id: 'numberParameter',
                                label: 'Number Parameter',
                                isLoading: isLoadingParameters,
                                options: numberParameters?.map((number: any) => ({
                                  label: number.label,
                                  value: number.id,
                                })),
                                value: actionDetails?.[index]?.parameterId
                                  ? [
                                      {
                                        label: numberParameters.find(
                                          (number: any) =>
                                            number.id === actionDetails[index].parameterId,
                                        )?.label,
                                        value: actionDetails[index].parameterId,
                                      },
                                    ]
                                  : null,
                                isSearchable: false,
                                placeholder: 'Select Number Parameter',
                                onChange: (_option: any) => {
                                  setValue(
                                    `actionDetails.${index}`,
                                    {
                                      ...actionDetails[index],
                                      parameterId: _option.value,
                                    },
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    },
                                  );
                                },
                              },
                            },
                          ]),
                      ...(selectedObjectType
                        ? [
                            {
                              type: InputTypes.SINGLE_SELECT,
                              props: {
                                id: 'objectProperty',
                                label: 'Object Property',
                                isLoading: isLoadingObjectType,
                                options: selectedObjectType?.properties?.reduce<
                                  Array<Record<string, any>>
                                >((acc, objectTypeProperty) => {
                                  if (
                                    (actionType?.[index] === AutomationActionActionType.SET_PROPERTY
                                      ? [
                                          InputTypes.SINGLE_SELECT,
                                          InputTypes.DATE,
                                          InputTypes.DATE_TIME,
                                        ]
                                      : [InputTypes.NUMBER]
                                    ).includes(objectTypeProperty.inputType)
                                  ) {
                                    acc.push({
                                      inputType: objectTypeProperty.inputType,
                                      externalId: objectTypeProperty.externalId,
                                      label: objectTypeProperty.displayName,
                                      value: objectTypeProperty.id,
                                      _options: objectTypeProperty.options,
                                    });
                                  }
                                  return acc;
                                }, []),
                                value: actionDetails?.[index]?.propertyId
                                  ? [
                                      {
                                        label: actionDetails[index].propertyDisplayName,
                                        value: actionDetails[index].propertyId,
                                      },
                                    ]
                                  : null,
                                isSearchable: false,
                                placeholder: 'Select Object Property',
                                onChange: (_option: any) => {
                                  delete actionDetails?.[index]?.['dateUnit'];
                                  setValue(
                                    `actionDetails.${index}`,
                                    {
                                      ...actionDetails[index],
                                      propertyId: _option.value,
                                      propertyInputType: _option.inputType,
                                      propertyExternalId: _option.externalId,
                                      propertyDisplayName: _option.label,
                                    },
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    },
                                  );
                                  setSelectedProperty(_option);
                                },
                              },
                            },
                          ]
                        : []),
                      ...(actionType?.[index] === AutomationActionActionType.SET_PROPERTY &&
                      selectedProperty
                        ? [
                            ...(selectedProperty.inputType === InputTypes.SINGLE_SELECT
                              ? [
                                  {
                                    type: InputTypes.SINGLE_SELECT,
                                    props: {
                                      id: 'value',
                                      label: 'Select Value',
                                      options: selectedProperty._options?.map((o: any) => ({
                                        label: o.displayName,
                                        value: o.id,
                                      })),
                                      value: actionDetails?.[index]?.choices
                                        ? actionDetails[index].choices?.map((c: any) => ({
                                            label: c.displayName,
                                            value: c.id,
                                          }))
                                        : null,
                                      isSearchable: false,
                                      placeholder: 'Select Value',
                                      onChange: (_option: any) => {
                                        setValue(
                                          `actionDetails.${index}`,
                                          {
                                            ...actionDetails[index],
                                            choices: [
                                              {
                                                id: _option.value,
                                                displayName: _option.label,
                                              },
                                            ],
                                          },
                                          {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                          },
                                        );
                                      },
                                    },
                                  },
                                ]
                              : [
                                  {
                                    type: InputTypes.SINGLE_SELECT,
                                    props: {
                                      id: 'setAs',
                                      label: 'Set As',
                                      options: getSetAsOptions(),
                                      value: actionDetails?.[index]?.entityId
                                        ? getSetAsOptions().filter(
                                            (o) =>
                                              o.value.captureProperty ===
                                                actionDetails[index]?.captureProperty &&
                                              o.value.entityType ===
                                                actionDetails[index]?.entityType,
                                          )
                                        : null,
                                      isSearchable: false,
                                      placeholder: 'Select Set As',
                                      onChange: (_option: any) => {
                                        setValue(
                                          `actionDetails.${index}`,
                                          {
                                            ...actionDetails[index],
                                            ..._option.value,
                                          },
                                          {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                          },
                                        );
                                      },
                                    },
                                  },
                                ]),
                          ]
                        : []),
                    ]),
              ]
            : []),
        ]}
      />
      {[InputTypes.DATE, InputTypes.DATE_TIME].includes(
        actionDetails?.[index]?.propertyInputType,
      ) && (
        <div className="inline-fields">
          <FormGroup
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'objectPropertyUnit',
                  label: 'Unit',
                  options: Object.entries(
                    getDateUnits(actionDetails[index].propertyInputType),
                  )?.map(([value, label]) => ({
                    label,
                    value,
                  })),
                  isSearchable: false,
                  placeholder: 'Select Unit',
                  value: actionDetails?.[index]?.dateUnit
                    ? [
                        {
                          label: getDateUnits(actionDetails[index].propertyInputType)[
                            actionDetails[index].dateUnit as keyof typeof getDateUnits
                          ],
                          value: actionDetails[index].dateUnit,
                        },
                      ]
                    : null,
                  onChange: (_option: any) => {
                    setValue(
                      `actionDetails.${index}`,
                      {
                        ...actionDetails[index],
                        dateUnit: _option.value,
                      },
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                },
              },
              {
                type: InputTypes.NUMBER,
                props: {
                  id: 'value',
                  label: 'Value',
                  placeholder: 'Enter Value',
                  defaultValue: actionDetails?.[index]?.value,
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    setValue(
                      `actionDetails.${index}`,
                      {
                        ...actionDetails[index],
                        value: e.target.value,
                      },
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                },
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ConfigureActions;
