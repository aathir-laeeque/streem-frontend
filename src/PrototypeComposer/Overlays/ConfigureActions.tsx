import {
  addTaskAction,
  archiveTaskAction,
  updateTaskAction,
} from '#PrototypeComposer/Tasks/actions';
import { Task } from '#PrototypeComposer/Tasks/types';
import {
  AutomationActionActionType,
  AutomationActionDetails,
  AutomationActionTriggerType,
  AutomationActionType,
  AutomationTargetEntityType,
  MandatoryParameter,
  Parameter,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import backIcon from '#assets/svg/back-icon.svg';
import { BaseModal, Button, FormGroup } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import { createFetchList } from '#hooks/useFetchData';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters, baseUrl } from '#utils/apiUrls';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { ObjectType } from '#views/Ontology/types';
import { Close } from '@material-ui/icons';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { keyBy, startCase, toLower } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    padding: 0;

    &-body {
      padding: 0 !important;

      .body {
        height: 70dvh;
        min-width: 40dvw;
        .header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eeeeee;
        }

        .header-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .heading {
          font-size: 16px !important;
        }

        .content {
          display: flex;
          height: 85%;
          overflow: auto;

          .empty-actions {
            display: flex;
            flex-direction: column;
            margin: auto;
            gap: 8px;
            > div {
              font-size: 14px;
            }
          }
          .actions-card-container {
            display: flex;
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            flex: 1 0 0;
            align-self: stretch;
          }
          .actions-card {
            display: flex;
            justify-content: space-between;
            padding: 16px;
            width: 100%;
            align-items: center;
            border: 1px solid #e0e0e0;
          }

          .action-card-label {
            display: flex;
            flex-direction: column;
            gap: 8px;

            &-top {
              font-size: 14px;
              font-weight: 700;
            }
            &-bottom {
              font-size: 14px;
            }
          }

          .actions-card:hover {
            background-color: #f4f4f4;
          }

          .add-action-button {
            padding: 8px 16px;
          }

          .action-card-form {
            padding: 24px;
            width: 100%;
            .fields {
              .form-group {
                padding: 12px 0px;
              }
              .inline-fields {
                .form-group {
                  flex: 1;
                  flex-direction: row;
                  padding-block: 0px;
                  gap: 12px;

                  > div {
                    flex: 1;
                    .input-wrapper {
                      flex: unset;
                    }
                  }
                }
              }
            }
          }

          .action-buttons-container {
            padding-bottom: 10px;
          }
        }
      }
    }
  }
`;

type Props = {
  task: Task;
  checklistId: string;
  isReadOnly?: boolean;
  state: Record<string, any>;
  setState: React.Dispatch<React.SetStateAction<any>>;
  activeTaskId: string;
};

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

const ConfigureActions: FC<CommonOverlayProps<Pick<Props, 'checklistId' | 'isReadOnly'>>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { checklistId, isReadOnly = false },
}) => {
  const [state, setState] = useState<any>({
    selectedAction: {},
    editActionFlag: false,
    addNewAction: false,
  });

  const {
    tasks: { listById, activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);

  const task = listById[activeTaskId];

  const dispatch = useDispatch();

  const { addNewAction, editActionFlag } = state;

  const archiveAction = (taskId: string, actionId: string, setFormErrors: any) => {
    dispatch(
      archiveTaskAction({
        taskId: taskId,
        actionId: actionId,
        setFormErrors,
      }),
    );
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showFooter={false}
        showHeader={false}
        showCloseIcon={false}
      >
        <div className="body">
          {!addNewAction ? (
            <div className="header">
              <Close className="close-icon" onClick={closeOverlay} />
              <div>
                <h2 className="heading">Task Action</h2>
              </div>
            </div>
          ) : (
            <div className="header">
              <Close className="close-icon" onClick={closeOverlay} />
              <div className="header-title">
                <img
                  src={backIcon}
                  alt="Back Icon"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      addNewAction: false,
                      selectedAction: {},
                      editActionFlag: false,
                    }));
                  }}
                />
                <h2 className="heading">
                  {editActionFlag ? 'Edit Configured Action' : 'Configure New Action'}
                </h2>
              </div>
            </div>
          )}
          <div className="content">
            {addNewAction ? (
              <ActionFormCard
                isReadOnly={isReadOnly}
                state={state}
                setState={setState}
                task={task}
                checklistId={checklistId}
                activeTaskId={activeTaskId}
              />
            ) : task.automations.length > 0 ? (
              <div className="actions-card-container">
                {!isReadOnly && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setState((prev) => ({ ...prev, addNewAction: true }));
                    }}
                    className="add-action-button"
                  >
                    Add New Action
                  </Button>
                )}
                {task.automations.map((currAction, index) => {
                  return (
                    <div
                      className="actions-card"
                      key={index}
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          selectedAction: currAction,
                          editActionFlag: true,
                          addNewAction: true,
                        }));
                      }}
                    >
                      <div className="action-card-label">
                        <div className="action-card-label-top">
                          {currAction.triggerType === AutomationActionTriggerType.TASK_STARTED
                            ? 'When Task is Started'
                            : 'When Task is Completed'}
                        </div>
                        <div className="action-card-label-bottom">{currAction.displayName}</div>
                      </div>
                      {!isReadOnly && (
                        <DeleteOutlineOutlinedIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              openOverlayAction({
                                type: OverlayNames.REASON_MODAL,
                                props: {
                                  modalTitle: 'Delete Action',
                                  modalDesc: `Are you sure you want to Delete this action ?`,
                                  shouldAskForReason: false,
                                  onSubmitHandler: (
                                    reason: string,
                                    setFormErrors: (errors?: Error[]) => void,
                                  ) => {
                                    archiveAction(task.id, currAction.id, setFormErrors);
                                  },
                                },
                              }),
                            );
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-actions">
                <div>No Actions Configured Yet</div>
                {!isReadOnly && (
                  <Button
                    variant="primary"
                    className="add-action-button"
                    onClick={() => {
                      setState((prev) => ({ ...prev, addNewAction: true }));
                    }}
                  >
                    Add New Action
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

const ActionFormCard: FC<Props> = ({
  isReadOnly,
  state,
  setState,
  task,
  checklistId,
  activeTaskId,
}) => {
  const {
    ontology: {
      objectTypes: { list, listLoading, pageable: objectTypePagination },
    },
    prototypeComposer: {
      data: checklistData,
      parameters: { listById: taskParametersById },
    },
  } = useTypedSelector((state) => state);
  const dispatch = useDispatch();
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [resourceParameters, setResourceParameters] = useState<any>([]);
  const [numberParameters, setNumberParameters] = useState<any>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>();
  const [selectedRelation, setSelectedRelation] = useState<any>();
  const { selectedAction, editActionFlag } = state;
  const [objectUrlPath, setObjectUrlPath] = useState<string>('');
  const { list: objects, reset: resetObjects } = createFetchList(objectUrlPath, {}, false);

  useEffect(() => {
    resetObjects({ url: objectUrlPath });
  }, [objectUrlPath]);

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    register,
    watch,
    reset,
    control,
    getValues,
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      displayName: '',
      actionType: null,
      actionDetails: null,
      triggerType: '',
    },
  });

  const { actionType, actionDetails, displayName, triggerType } = watch([
    'actionType',
    'actionDetails',
    'displayName',
    'triggerType',
  ]);

  const getSetAsOptions = (triggerType: string) => {
    return [
      triggerType === AutomationActionTriggerType.TASK_STARTED
        ? {
            label: 'Task Start time',
            value: {
              entityType: 'TASK',
              entityId: activeTaskId,
              captureProperty: 'START_TIME',
            },
          }
        : {
            label: 'Task End time',
            value: {
              entityType: 'TASK',
              entityId: activeTaskId,
              captureProperty: 'END_TIME',
            },
          },
    ];
  };

  const customActionDetailValidation = (value: any) => {
    if (actionType) {
      if (
        ![
          AutomationActionActionType.CREATE_OBJECT,
          AutomationActionActionType.ARCHIVE_OBJECT,
        ].includes(actionType)
      ) {
        let keysToValidate: string[] = ['parameterId'];
        let commonKeys = [
          'propertyId',
          'propertyInputType',
          'propertyExternalId',
          'propertyDisplayName',
          'referencedParameterId',
        ];
        if (actionType === AutomationActionActionType.SET_PROPERTY) {
          if (value?.propertyInputType) {
            if ([InputTypes.DATE, InputTypes.DATE_TIME].includes(value.propertyInputType)) {
              keysToValidate = ['entityType', 'entityId', 'captureProperty', 'dateUnit', 'value'];
            } else {
              keysToValidate = ['choices'];
            }
          }
        } else if (actionType === AutomationActionActionType.SET_RELATION) {
          commonKeys = [
            'referencedParameterId',
            'relationId',
            'relationExternalId',
            'relationDisplayName',
            'relationObjectTypeId',
          ];
        }
        return [...commonKeys, ...keysToValidate].every((key) => !!value?.[key]);
      }
      return true;
    }
    return false;
  };

  const fetchParameters = async () => {
    if (!resourceParameters.length && !numberParameters.length) {
      setIsLoadingParameters(true);
      const allParameters = {
        ...keyBy(checklistData?.parameters || {}, 'id'),
        ...taskParametersById,
      };
      const filterParametersByType = (
        objectHashMap: Record<string, Parameter>,
        parameterType: string[],
      ) => {
        const resultArray = [];

        for (const key in objectHashMap) {
          if (objectHashMap?.hasOwnProperty(key)) {
            const object = objectHashMap[key];
            if (parameterType.includes(object.type)) {
              resultArray.push(object);
            }
          }
        }

        return resultArray;
      };

      setResourceParameters(
        filterParametersByType(allParameters, [
          MandatoryParameter.RESOURCE,
          MandatoryParameter.MULTI_RESOURCE,
        ]),
      );

      setNumberParameters(
        filterParametersByType(allParameters, [
          MandatoryParameter.NUMBER,
          MandatoryParameter.CALCULATION,
        ]),
      );

      if (task.automations.length) {
        const _selectedResource =
          allParameters[selectedAction?.actionDetails?.referencedParameterId];
        if (_selectedResource) {
          fetchObjectType(_selectedResource.data.objectTypeId);
        }
      }
      setIsLoadingParameters(false);
    }
  };

  const fetchObjectType = async (id: string) => {
    setSelectedObjectType(undefined);
    setIsLoadingObjectType(true);
    const res = await request('GET', apiGetObjectTypes(id));
    setSelectedObjectType(res?.data);
    const { actionType: _actionType, actionDetails: _actionDetails } = getValues();
    if (
      (_actionType === AutomationActionActionType.SET_PROPERTY && _actionDetails?.propertyId) ||
      (_actionType === AutomationActionActionType.SET_RELATION && _actionDetails?.relationId)
    ) {
      const _selectedProperty = (res?.data?.properties || []).find(
        (property: any) => _actionDetails?.propertyId === property.id,
      );
      const _selectedRelation = (res?.data?.relations || []).find(
        (property: any) => _actionDetails?.relationId === property.id,
      );
      if (_selectedProperty) {
        setSelectedProperty({
          ..._selectedProperty,
          _options: _selectedProperty.options,
        });
      } else if (_selectedRelation) {
        setSelectedRelation(_selectedRelation);
      }
    }
    setIsLoadingObjectType(false);
  };

  const onSubmit = (data: {
    actionType: AutomationActionActionType;
    actionDetails: AutomationActionDetails;
    displayName: string;
    triggerType: AutomationActionTriggerType;
  }) => {
    const commonData = {
      type: AutomationActionType.PROCESS_BASED,
      orderTree: task.automations?.length + 1,
      targetEntityType:
        data.actionType === AutomationActionActionType.CREATE_OBJECT
          ? AutomationTargetEntityType.OBJECT
          : AutomationTargetEntityType.RESOURCE_PARAMETER,
      triggerDetails: {},
    };
    if (editActionFlag && selectedAction?.id) {
      dispatch(
        updateTaskAction({
          taskId: task.id,
          action: { ...commonData, ...selectedAction, ...data },
          actionId: selectedAction.id,
        }),
      );
    } else {
      dispatch(
        addTaskAction({
          taskId: task.id,
          action: { ...commonData, ...data },
        }),
      );
    }
    setState((prev) => ({
      addNewAction: false,
      selectedAction: {},
      editActionFlag: false,
    }));
  };

  useEffect(() => {
    reset({
      displayName: selectedAction.displayName,
      actionType: selectedAction.actionType,
      actionDetails: selectedAction.actionDetails,
      triggerType: selectedAction.triggerType,
    });
  }, [editActionFlag, selectedAction]);

  useEffect(() => {
    if (task.automations.length) {
      fetchParameters();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="action-card-form">
      <div className="fields">
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                id: 'displayName',
                name: 'displayName',
                label: 'Action Label',
                placeholder: 'Enter Label',
                value: displayName,
                defaultValue: displayName || null,
                ref: register({ required: true }),
                disabled: isReadOnly,
              },
            },
          ]}
        />
        <Controller
          control={control}
          name="triggerType"
          key="triggerType"
          shouldUnregister={false}
          defaultValue={triggerType || null}
          rules={{
            required: true,
          }}
          render={({ onChange, value }) => {
            return (
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'triggerType',
                      label: 'Trigger',
                      options: Object.keys(AutomationActionTriggerType).map((triggerType) =>
                        triggerType === AutomationActionTriggerType.TASK_STARTED
                          ? {
                              label: 'When task is started',
                              value: triggerType,
                            }
                          : {
                              label: 'When task is completed',
                              value: triggerType,
                            },
                      ),
                      placeholder: 'Select Trigger Type',
                      isDisabled: isReadOnly,
                      value: value
                        ? [
                            {
                              label:
                                value === AutomationActionTriggerType.TASK_STARTED
                                  ? 'When task is started'
                                  : 'When task is completed',
                              value: value,
                            },
                          ]
                        : null,
                      onChange: (_option: { value: string }) => {
                        onChange(_option.value);
                      },
                    },
                  },
                ]}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="actionType"
          key="actionType"
          shouldUnregister={false}
          defaultValue={actionType || null}
          rules={{
            required: true,
          }}
          render={({ onChange, value }) => {
            return (
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'actionType',
                      label: 'Action Type',
                      options: Object.keys(AutomationActionActionType).map((actionType) => ({
                        label: startCase(toLower(actionType)),
                        value: actionType,
                      })),
                      placeholder: 'Select Action Type',
                      isDisabled: isReadOnly,
                      value: value
                        ? [
                            {
                              label: startCase(toLower(value)),
                              value: value,
                            },
                          ]
                        : null,
                      onChange: (_option: { value: string }) => {
                        onChange(_option.value);
                        if (
                          _option.value === AutomationActionActionType.CREATE_OBJECT &&
                          !list.length
                        ) {
                          dispatch(
                            fetchObjectTypes({
                              usageStatus: 1,
                            }),
                          );
                        } else if (!resourceParameters.length) {
                          fetchParameters();
                        }
                        reset({
                          displayName: displayName,
                          triggerType: triggerType,
                          actionType: _option.value,
                          actionDetails: null,
                        });
                      },
                    },
                  },
                ]}
              />
            );
          }}
        />
        {actionType ? (
          <Controller
            control={control}
            name={`actionDetails`}
            key={`actionDetails`}
            defaultValue={actionDetails || null}
            shouldUnregister={false}
            rules={{
              required: true,
              validate: customActionDetailValidation,
            }}
            render={({ onChange, value }) => {
              return (
                <FormGroup
                  inputs={[
                    ...(actionType === AutomationActionActionType.CREATE_OBJECT
                      ? [
                          {
                            type: InputTypes.SINGLE_SELECT,
                            props: {
                              id: 'actionDetails',
                              label: 'Object Type',
                              isLoading: listLoading,
                              options: list.map((objectType) => ({
                                ...objectType,
                                label: objectType.displayName,
                                value: objectType.id,
                              })),
                              isSearchable: false,
                              isDisabled: isReadOnly,
                              placeholder: 'Select Object Type',
                              value: value
                                ? [
                                    {
                                      label: value?.objectTypeDisplayName,
                                      value: value?.objectTypeId,
                                    },
                                  ]
                                : null,
                              onMenuScrollToBottom: () => {
                                if (!listLoading && !objectTypePagination.last) {
                                  dispatch(
                                    fetchObjectTypes(
                                      {
                                        page: objectTypePagination.page + 1,
                                        size: DEFAULT_PAGE_SIZE,
                                        usageStatus: 1,
                                      },
                                      true,
                                    ),
                                  );
                                }
                              },
                              onChange: (_option: any) => {
                                onChange({
                                  urlPath: `/objects/partial?collection=${_option.externalId}`,
                                  collection: _option.externalId,
                                  objectTypeId: _option.id,
                                  objectTypeExternalId: _option.externalId,
                                  objectTypeDisplayName: _option.displayName,
                                });
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
                              options: resourceParameters
                                .filter((parameter: Parameter) => {
                                  if (actionType === AutomationActionActionType.SET_RELATION) {
                                    return parameter.type === MandatoryParameter.RESOURCE;
                                  } else {
                                    return true;
                                  }
                                })
                                .map((resource: Parameter) => ({
                                  ...resource.data,
                                  label: resource.label,
                                  value: resource.id,
                                  externalId: resource?.data?.objectTypeDisplayName,
                                })),
                              isSearchable: false,
                              placeholder: 'Select Resource Parameter',
                              isDisabled: isReadOnly,
                              value: value?.referencedParameterId
                                ? [
                                    {
                                      label: resourceParameters.find(
                                        (resource: any) =>
                                          resource.id === value.referencedParameterId,
                                      )?.label,
                                      value: value.referencedParameterId,
                                    },
                                  ]
                                : null,
                              onChange: (_option: any) => {
                                onChange({
                                  referencedParameterId: _option.value,
                                  parameterId: value?.parameterId,
                                });

                                if (actionType !== AutomationActionActionType.ARCHIVE_OBJECT) {
                                  fetchObjectType(_option.objectTypeId);
                                }
                              },
                            },
                          },
                          ...([
                            AutomationActionActionType.SET_PROPERTY,
                            AutomationActionActionType.ARCHIVE_OBJECT,
                            AutomationActionActionType.SET_RELATION,
                          ].includes(actionType)
                            ? []
                            : [
                                {
                                  type: InputTypes.SINGLE_SELECT,
                                  props: {
                                    id: 'numberParameter',
                                    label: 'Number / Calculation Parameter',
                                    isLoading: isLoadingParameters,
                                    options: numberParameters.map((number: any) => ({
                                      label: number.label,
                                      value: number.id,
                                    })),
                                    isDisabled: isReadOnly,
                                    value: value?.parameterId
                                      ? [
                                          {
                                            label: numberParameters.find(
                                              (number: any) => number.id === value.parameterId,
                                            )?.label,
                                            value: value.parameterId,
                                          },
                                        ]
                                      : null,
                                    isSearchable: false,
                                    placeholder: 'Select Number Parameter',
                                    onChange: (_option: any) => {
                                      onChange({
                                        ...actionDetails,
                                        parameterId: _option.value,
                                      });
                                    },
                                  },
                                },
                              ]),
                          ...(selectedObjectType &&
                          actionType !== AutomationActionActionType.ARCHIVE_OBJECT &&
                          actionType !== AutomationActionActionType.SET_RELATION
                            ? [
                                {
                                  type: InputTypes.SINGLE_SELECT,
                                  props: {
                                    id: 'objectProperty',
                                    label: 'Object Property',
                                    isLoading: isLoadingObjectType,
                                    isDisabled: isReadOnly,
                                    options: selectedObjectType?.properties?.reduce<
                                      Array<Record<string, any>>
                                    >((acc, objectTypeProperty) => {
                                      if (
                                        (actionType === AutomationActionActionType.SET_PROPERTY
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
                                    value: actionDetails?.propertyId
                                      ? [
                                          {
                                            label: actionDetails.propertyDisplayName,
                                            value: actionDetails.propertyId,
                                          },
                                        ]
                                      : null,
                                    placeholder: 'Select Object Property',
                                    onChange: (_option: any) => {
                                      delete actionDetails?.['dateUnit'];
                                      onChange({
                                        ...actionDetails,
                                        propertyId: _option.value,
                                        propertyInputType: _option.inputType,
                                        propertyExternalId: _option.externalId,
                                        propertyDisplayName: _option.label,
                                      });
                                      setSelectedProperty(_option);
                                    },
                                  },
                                },
                              ]
                            : []),
                          ...(actionType === AutomationActionActionType.SET_PROPERTY &&
                          selectedProperty
                            ? [
                                ...(selectedProperty.inputType === InputTypes.SINGLE_SELECT
                                  ? [
                                      {
                                        type: InputTypes.SINGLE_SELECT,
                                        props: {
                                          id: 'value',
                                          label: 'Select Value',
                                          options: (
                                            selectedProperty?._options ?? selectedProperty?.options
                                          ).map((o: any) => ({
                                            label: o?.displayName,
                                            value: o?.id,
                                          })),
                                          value: actionDetails?.choices
                                            ? actionDetails.choices?.map((c: any) => ({
                                                label: c.displayName,
                                                value: c.id,
                                              }))
                                            : null,
                                          isSearchable: false,
                                          isDisabled: isReadOnly,
                                          placeholder: 'Select Value',
                                          onChange: (_option: any) => {
                                            onChange({
                                              ...actionDetails,
                                              choices: [
                                                {
                                                  id: _option.value,
                                                  displayName: _option.label,
                                                },
                                              ],
                                            });
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
                                          options: getSetAsOptions(triggerType),
                                          value: actionDetails?.entityId
                                            ? getSetAsOptions(triggerType).filter(
                                                (o) =>
                                                  o.value.captureProperty ===
                                                    actionDetails.captureProperty &&
                                                  o.value.entityType === actionDetails.entityType,
                                              )
                                            : null,
                                          placeholder: 'Select Set As',
                                          isDisabled: isReadOnly,
                                          onChange: (_option: any) => {
                                            onChange({
                                              ...actionDetails,
                                              ..._option.value,
                                            });
                                          },
                                        },
                                      },
                                    ]),
                              ]
                            : []),
                          ...(selectedObjectType &&
                          actionType === AutomationActionActionType.SET_RELATION
                            ? [
                                {
                                  type: InputTypes.SINGLE_SELECT,
                                  props: {
                                    id: 'objectRelation',
                                    label: 'Object Relation',
                                    isLoading: isLoadingObjectType,
                                    isDisabled: isReadOnly,
                                    options: selectedObjectType?.relations?.map((relation) => ({
                                      value: relation.id,
                                      label: relation?.displayName,
                                      externalId: relation?.externalId,
                                      target: relation?.target,
                                      objectTypeId: relation?.objectTypeId,
                                      flags: relation?.flags,
                                    })),
                                    value: actionDetails?.relationId
                                      ? [
                                          {
                                            label: actionDetails.relationDisplayName,
                                            value: actionDetails.relationId,
                                          },
                                        ]
                                      : null,
                                    isSearchable: false,
                                    placeholder: 'Select Object Relation',
                                    onChange: (option: any) => {
                                      setSelectedRelation(option);
                                      setObjectUrlPath(`${baseUrl}${option?.target?.urlPath}`);
                                      onChange({
                                        ...actionDetails,
                                        relationId: option.value,
                                        relationExternalId: option.externalId,
                                        relationDisplayName: option.label,
                                        relationObjectTypeId: option.objectTypeId,
                                        flags: option.flags,
                                      });
                                    },
                                  },
                                },
                              ]
                            : []),
                          ...(selectedRelation &&
                          actionType === AutomationActionActionType.SET_RELATION
                            ? [
                                {
                                  type: InputTypes.SINGLE_SELECT,
                                  props: {
                                    id: 'value',
                                    label: 'Set Value',
                                    options: resourceParameters
                                      ?.filter(
                                        (param: Parameter) =>
                                          param?.data?.objectTypeId ===
                                          selectedRelation.objectTypeId,
                                      )
                                      .map((parameter: Parameter) => ({
                                        value: parameter.id,
                                        label: parameter?.label,
                                      })),
                                    isSearchable: false,
                                    isDisabled: isReadOnly,
                                    placeholder: 'Set Value',
                                    value: value?.parameterId
                                      ? [
                                          {
                                            label: resourceParameters.find(
                                              (resource: any) => resource.id === value.parameterId,
                                            )?.label,
                                            value: value.parameterId,
                                          },
                                        ]
                                      : null,
                                    onChange: (option: any) => {
                                      onChange({
                                        ...actionDetails,
                                        parameterId: option.value,
                                      });
                                    },
                                  },
                                },
                              ]
                            : []),
                        ]),
                  ]}
                />
              );
            }}
          />
        ) : null}
        {[InputTypes.DATE, InputTypes.DATE_TIME].includes(actionDetails?.propertyInputType) && (
          <div className="inline-fields">
            <Controller
              control={control}
              name={`actionDetails`}
              key={`actionDetails`}
              rules={{
                required: true,
                validate: customActionDetailValidation,
              }}
              render={({ onChange }) => {
                return (
                  <FormGroup
                    inputs={[
                      {
                        type: InputTypes.SINGLE_SELECT,
                        props: {
                          id: 'objectPropertyUnit',
                          label: 'Unit',
                          options: Object.entries(
                            getDateUnits(actionDetails.propertyInputType),
                          ).map(([value, label]) => ({
                            label,
                            value,
                          })),
                          isDisabled: isReadOnly,
                          value: actionDetails?.dateUnit
                            ? [
                                {
                                  label: getDateUnits(actionDetails.propertyInputType)[
                                    actionDetails.dateUnit as keyof typeof getDateUnits
                                  ],
                                  value: actionDetails.dateUnit,
                                },
                              ]
                            : null,
                          isSearchable: false,
                          placeholder: 'Select Unit',

                          onChange: (_option: any) => {
                            onChange({
                              ...actionDetails,
                              dateUnit: _option.value,
                            });
                          },
                        },
                      },
                      {
                        type: InputTypes.NUMBER,
                        props: {
                          id: 'value',
                          label: 'Value',
                          placeholder: 'Enter Value',
                          value: actionDetails?.value,
                          disabled: isReadOnly,
                          onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                            onChange({
                              ...actionDetails,
                              value: e.target.value,
                            });
                          },
                        },
                      },
                    ]}
                  />
                );
              }}
            />
          </div>
        )}
      </div>
      {!isReadOnly && (
        <div className="action-buttons-container">
          <Button variant="primary" type="submit" disabled={!isDirty || !isValid}>
            {editActionFlag ? 'Update' : 'Save'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ConfigureActions;
