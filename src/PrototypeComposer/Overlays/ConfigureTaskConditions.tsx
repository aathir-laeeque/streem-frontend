import {
  AutomationActionTriggerType,
  MandatoryParameter,
  Parameter,
} from '#PrototypeComposer/checklist.types';
import backIcon from '#assets/svg/back-icon.svg';
import { BaseModal, Button, FormGroup } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { Constraint } from '#types';
import { apiGetObjectTypes, apiTaskInterLocks, apiTaskInterLocksArchive } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { getErrorMsg, request } from '#utils/request';
import { ObjectType } from '#views/Ontology/types';
import { Close } from '@material-ui/icons';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { keyBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

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

            .info-message {
              color: #525252;
              font-size: 12px;
              font-weight: 400;
              margin-bottom: 16px;
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
  checklistId: string;
  isReadOnly?: boolean;
  state: Record<string, any>;
  setState: React.Dispatch<React.SetStateAction<any>>;
  activeTaskId: string;
};

const labelByConstraint = (inputType: InputTypes) => {
  switch (inputType) {
    case InputTypes.DATE:
    case InputTypes.TIME:
    case InputTypes.DATE_TIME:
      return {
        [Constraint.LTE]: 'not older than',
        [Constraint.GTE]: 'not later than',
      };

    case InputTypes.SINGLE_SELECT:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
      };

    default:
      return {
        [Constraint.EQ]: 'is equal to',
        [Constraint.NE]: 'is not equal to',
        [Constraint.LT]: 'is less than',
        [Constraint.GT]: 'is greater than',
        [Constraint.LTE]: 'is less than equal to',
        [Constraint.GTE]: 'is greater than equal to',
      };
  }
};

type StateProps = {
  selectedCondition: Record<string, string>;
  editConditionFlag: boolean;
  addNewCondition: boolean;
  taskConditionsList: Record<string, string>[];
  shouldToggle: boolean;
};

const ConfigureTaskConditions: FC<CommonOverlayProps<Pick<Props, 'checklistId' | 'isReadOnly'>>> =
  ({ closeAllOverlays, closeOverlay, props: { checklistId, isReadOnly = false } }) => {
    const [state, setState] = useState<StateProps>({
      selectedCondition: {},
      editConditionFlag: false,
      addNewCondition: false,
      taskConditionsList: [],
      shouldToggle: false,
    });

    const {
      tasks: { activeTaskId },
    } = useTypedSelector((state) => state.prototypeComposer);

    const dispatch = useDispatch();

    const { addNewCondition, editConditionFlag, taskConditionsList, shouldToggle } = state;

    const archiveCondition = (taskId: string, conditionId: string, setFormErrors: any) => {
      (async () => {
        try {
          const { data, errors } = await request(
            'DELETE',
            apiTaskInterLocksArchive(taskId, conditionId),
          );
          if (data) {
            setState((prev) => ({
              ...prev,
              shouldToggle: !prev.shouldToggle,
            }));
          }
          setFormErrors(errors);
        } catch (error) {
          console.error(error);
        }
      })();
    };

    const getAllConditionsByTask = async () => {
      try {
        const { data, errors } = await request('GET', apiTaskInterLocks(activeTaskId!));
        if (data) {
          setState((prev) => ({
            ...prev,
            taskConditionsList: data?.validations?.resourceParameterValidations || [],
          }));
        } else {
          throw getErrorMsg(errors);
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getAllConditionsByTask();
    }, [shouldToggle]);

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
            {!addNewCondition ? (
              <div className="header">
                <Close className="close-icon" onClick={closeOverlay} />
                <div>
                  <h2 className="heading">Task Conditions</h2>
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
                        addNewCondition: false,
                        selectedCondition: {},
                        editConditionFlag: false,
                      }));
                    }}
                  />
                  <h2 className="heading">
                    {editConditionFlag ? 'Edit Condition' : 'Configure New Condition'}
                  </h2>
                </div>
              </div>
            )}
            <div className="content">
              {addNewCondition ? (
                <ConditionFormCard
                  isReadOnly={isReadOnly}
                  state={state}
                  setState={setState}
                  checklistId={checklistId}
                  activeTaskId={activeTaskId!}
                />
              ) : taskConditionsList.length > 0 ? (
                <div className="actions-card-container">
                  {!isReadOnly && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setState((prev) => ({ ...prev, addNewCondition: true }));
                      }}
                      className="add-action-button"
                    >
                      Add New Condition
                    </Button>
                  )}
                  {taskConditionsList.map((currAction, index) => {
                    return (
                      <div
                        className="actions-card"
                        key={index}
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            selectedCondition: currAction,
                            editConditionFlag: true,
                            addNewCondition: true,
                          }));
                        }}
                      >
                        <div className="action-card-label">
                          <div className="action-card-label-top">
                            {currAction.triggerType === AutomationActionTriggerType.TASK_STARTED
                              ? 'When Task is Started'
                              : 'When Task is Completed'}
                          </div>
                          <div className="action-card-label-bottom">{currAction.label}</div>
                        </div>
                        {!isReadOnly && (
                          <DeleteOutlineOutlinedIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                openOverlayAction({
                                  type: OverlayNames.REASON_MODAL,
                                  props: {
                                    modalTitle: 'Delete Condition',
                                    modalDesc: `Are you sure you want to Delete this condition ?`,
                                    shouldAskForReason: false,
                                    onSubmitHandler: (
                                      reason: string,
                                      setFormErrors: (errors?: Error[]) => void,
                                    ) => {
                                      archiveCondition(activeTaskId!, currAction.id, setFormErrors);
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
                  <div>No conditions configured yet</div>
                  {!isReadOnly && (
                    <Button
                      variant="primary"
                      className="add-action-button"
                      onClick={() => {
                        setState((prev) => ({ ...prev, addNewCondition: true }));
                      }}
                    >
                      Add New Condition
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

const ConditionFormCard: FC<Props> = ({ isReadOnly, state, setState, activeTaskId }) => {
  const {
    prototypeComposer: {
      data: checklistData,
      parameters: { listById: taskParametersById },
    },
  } = useTypedSelector((state) => state);
  const dispatch = useDispatch();
  const [isLoadingParameters, setIsLoadingParameters] = useState<boolean>(false);
  const [resourceParameters, setResourceParameters] = useState<Parameter[]>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState<boolean>(false);
  const { selectedCondition, editConditionFlag, taskConditionsList } = state;

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    watch,
    reset,
    control,
  } = useForm<Record<string, Record<string, string>>>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      conditionDetails: {},
    },
  });

  const { conditionDetails } = watch(['conditionDetails']);

  const fetchParameters = async () => {
    if (!resourceParameters.length) {
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

      setResourceParameters(filterParametersByType(allParameters, [MandatoryParameter.RESOURCE]));

      if (editConditionFlag) {
        const dependentParameter = allParameters[selectedCondition?.parameterId];
        if (dependentParameter) {
          fetchObjectType(dependentParameter.data.objectTypeId);
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
    setIsLoadingObjectType(false);
  };

  const onSubmit = (data: any) => {
    let conditions = [];

    if (selectedCondition?.id) {
      conditions = taskConditionsList.map((condition: Record<string, string>) => {
        if (condition.id === selectedCondition.id) {
          return {
            ...condition,
            ...data.conditionDetails,
          };
        }
        return condition;
      });
    } else {
      conditions = [
        ...taskConditionsList,
        {
          ...data.conditionDetails,
          id: uuidv4(),
        },
      ];
    }
    createCondition(conditions);
  };

  const createCondition = async (conditions: Record<string, string>[]) => {
    try {
      const { data, errors } = await request('PATCH', apiTaskInterLocks(activeTaskId), {
        data: {
          validations: {
            resourceParameterValidations: conditions,
          },
        },
      });
      if (data) {
        setState((prev: StateProps) => ({
          ...prev,
          addNewCondition: false,
          selectedCondition: {},
          editConditionFlag: false,
          shouldToggle: !prev.shouldToggle,
        }));
      } else {
        throw getErrorMsg(errors);
      }
    } catch (error) {
      console.error(error);
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  const customConditionDetailValidation = (value: Record<string, string>) => {
    if (conditionDetails) {
      let keysToValidate = [
        'label',
        'triggerType',
        'constraint',
        'parameterId',
        'errorMessage',
        'propertyId',
        'value',
      ];

      return keysToValidate.every((key) => !!value?.[key]);
    }
    return false;
  };

  useEffect(() => {
    reset({
      conditionDetails: selectedCondition,
    });
  }, [editConditionFlag, selectedCondition]);

  useEffect(() => {
    fetchParameters();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="action-card-form">
      <div className="fields">
        <Controller
          control={control}
          name={`conditionDetails`}
          key={`conditionDetails`}
          defaultValue={conditionDetails || null}
          shouldUnregister={false}
          rules={{
            required: true,
            validate: customConditionDetailValidation,
          }}
          render={({ onChange, value }) => {
            return (
              <FormGroup
                inputs={[
                  {
                    type: InputTypes.SINGLE_LINE,
                    props: {
                      id: 'label',
                      label: 'Condition Label',
                      placeholder: 'Enter Label',
                      disabled: isReadOnly,
                      value: value?.label || null,
                      onChange: (_option: Record<string, string>) => {
                        onChange({
                          ...conditionDetails,
                          label: _option.value,
                        });
                      },
                    },
                  },
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
                      value: value?.triggerType
                        ? [
                            {
                              label:
                                value.triggerType === AutomationActionTriggerType.TASK_STARTED
                                  ? 'When task is started'
                                  : 'When task is completed',
                              value: value.triggerType,
                            },
                          ]
                        : null,
                      onChange: (_option: { value: string }) => {
                        onChange({ ...conditionDetails, triggerType: _option.value });
                      },
                    },
                  },
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectType',
                      label: 'Object Type',
                      isLoading: isLoadingParameters,
                      options: resourceParameters.map((resource: Parameter) => ({
                        ...resource.data,
                        label: resource.label,
                        value: resource.id,
                        externalId: resource?.data?.objectTypeDisplayName,
                      })),
                      isSearchable: false,
                      placeholder: 'Select Resource Parameter',
                      isDisabled: isReadOnly,
                      value: value?.parameterId
                        ? [
                            {
                              label: resourceParameters.find(
                                (resource: Parameter) => resource.id === value.parameterId,
                              )?.label,
                              value: value.parameterId,
                            },
                          ]
                        : null,
                      onChange: (_option: any) => {
                        delete conditionDetails?.['propertyId'];
                        delete conditionDetails?.['constraint'];
                        onChange({
                          ...conditionDetails,
                          parameterId: _option.value,
                        });
                        fetchObjectType(_option.objectTypeId);
                      },
                    },
                  },
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'objectProperty',
                      label: 'Object Property',
                      isLoading: isLoadingObjectType,
                      isDisabled: isReadOnly,
                      options: selectedObjectType?.properties?.reduce<Array<Record<string, any>>>(
                        (acc, objectTypeProperty) => {
                          if (
                            ![
                              InputTypes.SINGLE_LINE,
                              InputTypes.MULTI_LINE,
                              InputTypes.MULTI_SELECT,
                            ].includes(objectTypeProperty.inputType)
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
                        },
                        [],
                      ),
                      value: conditionDetails?.propertyId
                        ? [
                            {
                              label: conditionDetails.propertyDisplayName,
                              value: conditionDetails.propertyId,
                            },
                          ]
                        : null,
                      placeholder: 'Select Object Property',
                      onChange: (_option: any) => {
                        delete conditionDetails?.['constraint'];
                        delete conditionDetails?.['value'];
                        onChange({
                          ...conditionDetails,
                          propertyId: _option.value,
                          propertyInputType: _option.inputType,
                          propertyExternalId: _option.externalId,
                          propertyDisplayName: _option.label,
                        });
                      },
                    },
                  },
                  {
                    type: InputTypes.SINGLE_SELECT,
                    props: {
                      id: 'condition',
                      label: 'Condition',
                      isDisabled: isReadOnly,
                      options: Object.entries(
                        labelByConstraint(conditionDetails?.propertyInputType),
                      ).map(([value, label]) => ({
                        label,
                        value,
                      })),
                      value: value?.constraint
                        ? [
                            {
                              label: labelByConstraint(conditionDetails?.propertyInputType)[
                                value?.constraint
                              ],
                              value: value?.constraint,
                            },
                          ]
                        : null,
                      placeholder: 'Select Condition',
                      onChange: (_option: Record<string, string>) => {
                        onChange({
                          ...conditionDetails,
                          constraint: _option.value,
                        });
                      },
                    },
                  },

                  {
                    type: conditionDetails?.propertyInputType
                      ? conditionDetails.propertyInputType
                      : InputTypes.SINGLE_LINE,
                    props: {
                      id: 'value',
                      label: 'Value',
                      isDisabled: isReadOnly,
                      ...(conditionDetails.propertyInputType === InputTypes.SINGLE_SELECT && {
                        options: selectedObjectType?.properties
                          .find(
                            (objectTypeProperty) =>
                              objectTypeProperty.id === conditionDetails.propertyId,
                          )
                          ?.options?.map((option) => ({
                            label: option.displayName,
                            value: option.id,
                          })),
                      }),
                      placeholder: 'Enter Value',
                      value: value?.value
                        ? conditionDetails.propertyInputType === InputTypes.SINGLE_SELECT
                          ? [
                              {
                                value: value.value,
                                label: selectedObjectType?.properties
                                  ?.find(
                                    (objectTypeProperty) =>
                                      objectTypeProperty.id === conditionDetails.propertyId,
                                  )
                                  ?.options?.find((option) => option.id === value.value)
                                  ?.displayName,
                              },
                            ]
                          : value.value
                        : null,
                      onChange: (_option: Record<string, string>) => {
                        onChange({
                          ...conditionDetails,
                          value: _option.value,
                        });
                      },
                    },
                  },
                  {
                    type: InputTypes.SINGLE_LINE,
                    props: {
                      id: 'errorMessage',
                      label: 'Error Message',
                      isDisabled: isReadOnly,
                      placeholder: 'Enter Message',
                      value: conditionDetails?.errorMessage || null,
                      onChange: (_option: Record<string, string>) => {
                        onChange({
                          ...conditionDetails,
                          errorMessage: _option.value,
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
      <div className="info-message">
        This Message will be shown to the user if the condition is not met
      </div>
      {!isReadOnly && (
        <div className="action-buttons-container">
          <Button variant="primary" type="submit" disabled={!isDirty || !isValid}>
            {editConditionFlag ? 'Update' : 'Save'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ConfigureTaskConditions;
