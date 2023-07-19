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
import { addMultipleTaskAction, archiveTaskAction } from '#PrototypeComposer/Tasks/actions';
import { Task } from '#PrototypeComposer/Tasks/types';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters } from '#utils/apiUrls';
import { FilterOperators, InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { Cardinality, ObjectType } from '#views/Ontology/types';
import AddIcon from '@material-ui/icons/Add';
import { isArray, startCase, toLower } from 'lodash';
import React, { FC, useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { createFetchList } from '#hooks/useFetchData';
import { baseUrl } from '#utils/apiUrls';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';

const Wrapper = styled.div`
  .modal {
    padding: 0;

    &-body {
      padding: 0 !important;

      .body {
        display: flex;

        .section {
          flex-direction: column;
          display: flex;
          flex: 1;
          padding: 16px 16px 0;
          height: 70dvh;
          min-width: 30dvw;

          &-left {
            border-right: 1px solid #eeeeee;
            .actions-card-container {
              display: flex;
              flex-direction: column;
              gap: 16px;

              h4 {
                margin: 0;
                font-weight: 600;
              }
              > div {
                display: flex;
                gap: 16px;
                flex-direction: column;

                .actions-card {
                  height: 2.5rem;
                  flex-grow: 1;
                  display: flex;
                  gap: 16px;
                  flex-direction: row;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 8px;
                  padding: 0.75rem 0.5rem;
                  border-bottom: solid 1px #e0e0e0;
                  cursor: pointer;
                }
              }
            }
          }

          &-right {
            overflow: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            h4 {
              font-size: 14px;
              font-weight: 700;
              margin: 0;
            }

            .check {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

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

            &-buttons-container {
              display: flex;
              margin-left: auto;
            }
          }
        }
      }
    }

    &-footer {
      justify-content: space-between;
      margin-left: auto;
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

let commonKeys = [
  'propertyId',
  'propertyInputType',
  'propertyExternalId',
  'propertyDisplayName',
  'referencedParameterId',
  'objectTypeDisplayName',
];

type Props = {
  task: Task;
  checklistId: string;
  isReadOnly?: boolean;
  isSaveDisable: boolean;
  append: (obj: object | object[]) => void;
  remove: (index?: number | number[]) => void;
  insert: (
    index: number,
    value: Partial<Record<string, any>> | Partial<Record<string, any>>[],
    shouldFocus?: boolean,
  ) => void;
  fields: any[];
  state: Record<string, any>;
  setState: React.Dispatch<React.SetStateAction<any>>;
};

const ConfigureActions: FC<CommonOverlayProps<Pick<Props, 'task' | 'checklistId' | 'isReadOnly'>>> =
  ({ closeAllOverlays, closeOverlay, props: { task, checklistId, isReadOnly = false } }) => {
    const {
      formState: { isDirty, isValid },
      reset,
      control,
    } = useForm({
      mode: 'onChange',
      criteriaMode: 'all',
      shouldUnregister: false,
      defaultValues: {
        actions: [{}],
      },
    });

    const [state, setState] = useState<any>({
      selectedAction: {},
      editIndex: null,
      editActionId: null,
      editActionFlag: false,
    });

    const { fields, append, remove, insert } = useFieldArray({
      control,
      name: 'actions',
      keyName: 'key',
    });

    useEffect(() => {
      if (task.automations.length) {
        reset({ actions: [{}, ...task?.automations] || [] });

        if (isReadOnly) {
          const firstAction = task.automations[0];
          setState(() => ({
            selectedAction: firstAction,
          }));
        }
      }
    }, []);

    return (
      <Wrapper>
        <BaseModal
          closeAllModals={closeAllOverlays}
          closeModal={closeOverlay}
          title="Configure Action"
          showFooter={false}
        >
          <div className="body">
            <div className="section section-left">
              {fields?.length > 1 || task.automations.length ? (
                <div className="actions-card-container">
                  <h4>Configured Actions</h4>
                  <div>
                    {fields
                      .filter((currAction) => !!currAction?.displayName)
                      .map((currAction, index) => {
                        return (
                          <div
                            className="actions-card"
                            key={index}
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                selectedAction: currAction,
                                editIndex: index + 1,
                                editActionId: currAction?.id,
                                editActionFlag: true,
                              }));
                            }}
                          >
                            {currAction.displayName}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div style={{ margin: 'auto' }}>No Configured Action</div>
              )}
            </div>
            {
              <div className="section section-right">
                <ActionFormCard
                  isReadOnly={isReadOnly}
                  state={state}
                  setState={setState}
                  task={task}
                  fields={fields}
                  checklistId={checklistId}
                  append={append}
                  remove={remove}
                  insert={insert}
                  isSaveDisable={!isDirty || !isValid}
                />
              </div>
            }
          </div>
        </BaseModal>
      </Wrapper>
    );
  };

export default ConfigureActions;

const ActionFormCard: FC<Props> = ({
  isReadOnly,
  state,
  setState,
  task,
  fields,
  checklistId,
  append,
  remove,
  insert,
  isSaveDisable,
}) => {
  const {
    ontology: {
      objectTypes: { list, listLoading, pageable: objectTypePagination },
    },
    prototypeComposer: {
      tasks: { activeTaskId },
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
  const { editActionId, editIndex, selectedAction, editActionFlag } = state;
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
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      displayName: '',
      actionType: null,
      actionDetails: null,
    },
  });

  const { actionType, actionDetails, displayName } = watch([
    'actionType',
    'actionDetails',
    'displayName',
  ]);

  const archiveAction = (taskId: string, actionId: string) => {
    dispatch(
      archiveTaskAction({
        taskId: taskId,
        actionId: actionId,
      }),
    );
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

  const customActionDetailValidation = (value: any) => {
    if (actionType) {
      if (
        ![
          AutomationActionActionType.CREATE_OBJECT,
          AutomationActionActionType.ARCHIVE_OBJECT,
        ].includes(actionType)
      ) {
        let keysToValidate: string[] = [];
        if (actionType === AutomationActionActionType.SET_PROPERTY) {
          commonKeys = [
            'propertyId',
            'propertyInputType',
            'propertyExternalId',
            'propertyDisplayName',
            'referencedParameterId',
            'objectTypeDisplayName',
          ];
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
            'objectTypeDisplayName',
            'relationId',
            'relationExternalId',
            'relationDisplayName',
            'relationObjectTypeId',
          ];
          keysToValidate = ['parameterId'];
        } else {
          keysToValidate = ['parameterId'];
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
      const [resources, numbers, calculation, multiresource] = await Promise.all([
        getParameterByType(MandatoryParameter.RESOURCE),
        getParameterByType(MandatoryParameter.NUMBER),
        getParameterByType(MandatoryParameter.CALCULATION),
        getParameterByType(MandatoryParameter.MULTI_RESOURCE),
      ]);
      if (
        task.automations.length &&
        task.automations[0].actionType !== AutomationActionActionType.CREATE_OBJECT
      ) {
        const _selectedResource = resources.data.find(
          (r: any) => r.id === task.automations[0]?.actionDetails?.referencedParameterId,
        );
        if (_selectedResource) {
          fetchObjectType(_selectedResource.data.objectTypeId);
        }
      }
      setResourceParameters([...resources.data, ...multiresource.data]);
      setNumberParameters([...numbers.data, ...calculation.data]);
      setIsLoadingParameters(false);
    }
  };

  const fetchObjectType = async (id: string) => {
    setSelectedObjectType(undefined);
    setIsLoadingObjectType(true);
    const res = await request('GET', apiGetObjectTypes(id));
    setSelectedObjectType(res?.data);
    if (actionType === AutomationActionActionType.SET_PROPERTY && actionDetails?.propertyId) {
      const _selectedProperty = (res?.data?.properties || []).find(
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

  const onSubmit = () => {
    const actions = fields
      .filter((currAction: Record<string, any>) => !!currAction.displayName)
      .map((currAction: Record<string, any>, index: Number) => {
        if (!currAction.id) {
          const commonData = {
            type: AutomationActionType.PROCESS_BASED,
            orderTree: index + 1,
            triggerType: AutomationActionTriggerType.TASK_COMPLETED,
            targetEntityType:
              currAction.actionType === AutomationActionActionType.CREATE_OBJECT
                ? AutomationTargetEntityType.OBJECT
                : AutomationTargetEntityType.RESOURCE_PARAMETER,
            triggerDetails: {},
          };
          let _actionDetails = currAction.actionDetails;
          if (currAction.actionType !== AutomationActionActionType.CREATE_OBJECT) {
            let keysToValidate: string[] = [];
            if (currAction.actionType === AutomationActionActionType.SET_PROPERTY) {
              commonKeys = [
                'propertyId',
                'propertyInputType',
                'propertyExternalId',
                'propertyDisplayName',
                'referencedParameterId',
                'objectTypeDisplayName',
              ];
              if (_actionDetails?.propertyInputType) {
                if (
                  [InputTypes.DATE, InputTypes.DATE_TIME].includes(_actionDetails.propertyInputType)
                ) {
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
            } else if (currAction.actionType === AutomationActionActionType.SET_RELATION) {
              commonKeys = [
                'referencedParameterId',
                'objectTypeDisplayName',
                'relationId',
                'relationExternalId',
                'relationDisplayName',
                'relationObjectTypeId',
              ];
              keysToValidate = ['parameterId'];
            } else {
              keysToValidate = ['parameterId'];
            }
            _actionDetails = [...commonKeys, ...keysToValidate].reduce<any>((acc, k) => {
              acc[k] = (currAction.actionDetails as unknown as any)?.[k];
              return acc;
            }, {});
          }
          return {
            displayName: currAction.displayName,
            actionType: currAction.actionType,
            actionDetails: _actionDetails,
            ...commonData,
          };
        } else {
          return currAction;
        }
      });

    dispatch(
      addMultipleTaskAction({
        taskId: task.id,
        actions,
      }),
    );
  };

  const onAddAction = (data: {
    actionType: AutomationActionActionType;
    actionDetails: AutomationActionDetails;
    displayName: string;
  }) => {
    if (editActionFlag) {
      remove(editIndex);
      insert(editIndex, { ...selectedAction, ...data });
    } else {
      append({ ...data });
    }
    setState((prev) => ({
      ...prev,
      selectedAction: {},
      editActionId: null,
      editIndex: null,
      editActionFlag: false,
    }));
  };

  useEffect(() => {
    if (editActionFlag && selectedAction.actionType === 'SET_PROPERTY') {
      const property = selectedObjectType?.properties?.filter(
        (currProperty) => currProperty?.id === selectedAction?.actionDetails?.propertyId,
      )?.[0];
      setSelectedProperty(property);
    }
    if (editActionFlag && selectedAction.actionType === 'SET_RELATION') {
      const relation = selectedObjectType?.relations?.filter(
        (currRelation) => currRelation?.id === selectedAction?.actionDetails?.relationId,
      )?.[0];
      setSelectedRelation(relation);
    }
    reset({
      displayName: selectedAction.displayName,
      actionType: selectedAction.actionType,
      actionDetails: selectedAction.actionDetails,
    });
  }, [editActionFlag, selectedAction]);

  useEffect(() => {
    if (task.automations.length) {
      fetchParameters();
    }
  }, []);

  return (
    <>
      <div className="check">
        <h4>Configure an Action</h4>
        {!isReadOnly && editActionFlag && (
          <DeleteOutlineOutlinedIcon
            onClick={() => {
              if (editActionId) {
                archiveAction(task.id, editActionId);
              }
              remove(editIndex);
              setState((prev) => ({
                ...prev,
                selectedAction: {},
                editActionId: null,
                editIndex: null,
                editActionFlag: false,
              }));
            }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit(onAddAction)}>
        <div className="fields">
          <FormGroup
            inputs={[
              {
                type: InputTypes.SINGLE_LINE,
                props: {
                  id: 'displayName',
                  name: 'displayName',
                  label: 'Action Label',
                  isSearchable: false,
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
                        isSearchable: false,
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
                                options: resourceParameters.map((resource: any) => ({
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
                                    objectTypeDisplayName: _option.objectTypeDisplayName,
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
                                      isSearchable: false,
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
                                              selectedProperty?._options ??
                                              selectedProperty?.options
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
                                            options: getSetAsOptions(),
                                            value: actionDetails?.entityId
                                              ? getSetAsOptions().filter(
                                                  (o) =>
                                                    o.value.captureProperty ===
                                                      actionDetails.captureProperty &&
                                                    o.value.entityType === actionDetails.entityType,
                                                )
                                              : null,
                                            isSearchable: false,
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
                                          (param) =>
                                            param?.data?.objectTypeId ===
                                            selectedRelation.objectTypeId,
                                        )
                                        .map((parameter) => ({
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
                                                (resource: any) =>
                                                  resource.id === value.parameterId,
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
          <div className="section-right-buttons-container">
            <Button variant="secondary" disabled={!isDirty || !isValid} type="submit">
              <AddIcon />
              Add
            </Button>
            <Button
              variant="primary"
              disabled={isSaveDisable || isDirty}
              onClick={() => {
                onSubmit();
              }}
            >
              Save All
            </Button>
          </div>
        )}
      </form>
    </>
  );
};
