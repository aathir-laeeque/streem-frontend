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
  addMultipleTaskAction,
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
import AddIcon from '@material-ui/icons/Add';
import { startCase, toLower } from 'lodash';
import React, { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

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
          height: 70vh;
          min-width: 30vw;

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

const commonKeys = [
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
};

const ConfigureCheck: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { task, checklistId, isReadOnly = false },
}) => {
  const dispatch = useDispatch();
  const {
    ontology: {
      objectTypes: { list, listLoading },
    },
    prototypeComposer: {
      tasks: { activeTaskId },
    },
  } = useTypedSelector((state) => state);

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
    reset,
    errors,
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { actionType, actionDetails, actionLabel } = watch([
    'actionType',
    'actionDetails',
    'actionLabel',
  ]);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [resourceParameters, setResourceParameters] = useState<any>([]);
  const [numberParameters, setNumberParameters] = useState<any>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>();
  const [state, setState] = useState<any>({
    selectedActionOption: {},
    actions: [],
    editActionFlag: false,
    editIndex: null,
    editActionId: null,
    allowEditSave: false,
  });

  const { actions, editActionFlag, editIndex, editActionId, allowEditSave } = state;

  useEffect(() => {
    if (task.automations.length) {
      fetchParameters();
      if (isReadOnly) {
        const firstAction = task.automations[0];
        setValue('actionLabel', firstAction.displayName);
        setValue('actionDetails', firstAction.actionDetails);
        setValue('actionType', firstAction.actionType);
        setState((prev) => ({
          ...prev,
          editActionFlag: true,
          editIndex: 0,
          editActionId: firstAction.id,
          actions: task.automations,
        }));
      } else {
        setState((prev) => ({ ...prev, actions: task.automations }));
      }
    }
  }, []);

  useEffect(() => {
    if (editActionFlag && actionType === 'SET_PROPERTY') {
      const property = selectedObjectType?.properties?.filter(
        (currProperty) => currProperty?.id === actionDetails?.propertyId,
      )?.[0];
      setSelectedProperty(property);
    }
  }, [editActionFlag]);

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

  const onSubmit = (data: {
    actionType: AutomationActionActionType;
    actionDetails: AutomationActionDetails;
    actionLabel: string;
  }) => {
    let maxOrderTree = actions.length > 0 ? actions[actions.length - 1] : 1;
    const commonData = {
      type: AutomationActionType.PROCESS_BASED,
      orderTree: actions.length + 1,
      triggerType: AutomationActionTriggerType.TASK_COMPLETED,
      targetEntityType:
        data.actionType === AutomationActionActionType.CREATE_OBJECT
          ? AutomationTargetEntityType.OBJECT
          : AutomationTargetEntityType.RESOURCE_PARAMETER,
      triggerDetails: {},
    };
    let _actionDetails = data.actionDetails;
    if (data.actionType !== AutomationActionActionType.CREATE_OBJECT) {
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

    if (editActionFlag) {
      setState((prev) => ({
        ...prev,
        actions: prev.actions.map((currAction, index) => {
          if (editActionId === currAction.id) {
            return {
              ...currAction,
              displayName: data.actionLabel,
              actionDetails: data.actionDetails,
              actionType: data.actionType,
            };
          } else {
            return currAction;
          }
        }),
        editActionFlag: false,
        editIndex: null,
        allowEditSave: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        actions: [
          ...prev.actions,
          {
            displayName: data.actionLabel,
            actionType: data.actionType,
            actionDetails: _actionDetails,
            ...commonData,
          },
        ],
        allowEditSave: false,
      }));
    }
    reset({ actionLabel: '' });
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
  const archiveAction = (taskId: string, actionId: string) => {
    dispatch(
      archiveTaskAction({
        taskId: taskId,
        actionId: actionId,
      }),
    );
  };

  register('actionLabel', {
    required: true,
  });

  register('actionType', {
    required: true,
  });

  register('actionDetails', {
    required: true,
    validate: {
      isValid: (v) => {
        if (actionType) {
          if (
            ![
              AutomationActionActionType.CREATE_OBJECT,
              AutomationActionActionType.ARCHIVE_OBJECT,
            ].includes(actionType)
          ) {
            let keysToValidate: string[] = [];
            if (actionType === AutomationActionActionType.SET_PROPERTY) {
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
            {actions?.length ? (
              <div className="actions-card-container">
                <h4>Configured Actions</h4>
                <div>
                  {actions.map((currAction, index) => {
                    return (
                      <div
                        className="actions-card"
                        onClick={() => {
                          setValue('actionLabel', currAction.displayName, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setValue('actionType', currAction.actionType, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setValue('actionDetails', currAction.actionDetails, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setState((prev) => ({
                            ...prev,
                            editActionFlag: true,
                            editIndex: index,
                            editActionId: currAction.id,
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
          {(!isReadOnly || editActionFlag) && (
            <div className="section section-right">
              <div className="check">
                <h4>Configure an Action</h4>
                {!isReadOnly && editActionFlag && (
                  <DeleteOutlineOutlinedIcon
                    onClick={() => {
                      if (editActionId) {
                        archiveAction(task.id, editActionId);
                        setState((prev) => ({
                          ...prev,
                          actions: prev.actions.filter(
                            (currAction) => currAction.id !== editActionId,
                          ),
                          editActionFlag: false,
                          editIndex: null,
                        }));
                      } else {
                        setState((prev) => ({
                          ...prev,
                          actions: prev.actions.filter((currAction, index) => index !== editIndex),
                          editActionFlag: false,
                          editIndex: null,
                        }));
                      }

                      reset({ actionLabel: '' });
                    }}
                  />
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="fields">
                  <FormGroup
                    inputs={[
                      {
                        type: InputTypes.SINGLE_LINE,
                        props: {
                          id: 'actionLabel',
                          label: 'Action Label',
                          isSearchable: false,
                          placeholder: 'Enter Label',
                          value: actionLabel,
                          disabled: isReadOnly,
                          onChange: ({ value }: { value: string }) => {
                            setValue('actionLabel', value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          },
                        },
                      },
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
                          value: actionType
                            ? [
                                {
                                  label: startCase(toLower(actionType)),
                                  value: actionType,
                                },
                              ]
                            : null,
                          onChange: (_option: { value: string }) => {
                            setValue(
                              'actionDetails',
                              {},
                              {
                                shouldDirty: true,
                                // shouldValidate: true,
                              },
                            );
                            setValue('actionType', _option.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
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
                          },
                        },
                      },
                      ...(actionType
                        ? [
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
                                      value: actionDetails?.objectTypeId
                                        ? [
                                            {
                                              label: actionDetails?.objectTypeDisplayName,
                                              value: actionDetails?.objectTypeId,
                                            },
                                          ]
                                        : null,
                                      onChange: (_option: any) => {
                                        setValue(
                                          'actionDetails',
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
                                      options: resourceParameters.map((resource: any) => ({
                                        ...resource.data,
                                        label: resource.label,
                                        value: resource.id,
                                      })),
                                      isSearchable: false,
                                      placeholder: 'Select Resource Parameter',
                                      isDisabled: isReadOnly,
                                      value: actionDetails?.referencedParameterId
                                        ? [
                                            {
                                              label: resourceParameters.find(
                                                (resource: any) =>
                                                  resource.id ===
                                                  actionDetails.referencedParameterId,
                                              )?.label,
                                              value: actionDetails.referencedParameterId,
                                            },
                                          ]
                                        : null,
                                      onChange: (_option: any) => {
                                        setValue(
                                          'actionDetails',
                                          {
                                            referencedParameterId: _option.value,
                                            parameterId: actionDetails?.parameterId,
                                            objectTypeDisplayName: _option.objectTypeDisplayName,
                                          },
                                          {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                          },
                                        );

                                        if (
                                          actionType !== AutomationActionActionType.ARCHIVE_OBJECT
                                        ) {
                                          fetchObjectType(_option.objectTypeId);
                                        }
                                      },
                                    },
                                  },
                                  ...([
                                    AutomationActionActionType.SET_PROPERTY,
                                    AutomationActionActionType.ARCHIVE_OBJECT,
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
                                            value: actionDetails?.parameterId
                                              ? [
                                                  {
                                                    label: numberParameters.find(
                                                      (number: any) =>
                                                        number.id === actionDetails.parameterId,
                                                    )?.label,
                                                    value: actionDetails.parameterId,
                                                  },
                                                ]
                                              : null,
                                            isSearchable: false,
                                            placeholder: 'Select Number Parameter',
                                            onChange: (_option: any) => {
                                              setValue(
                                                'actionDetails',
                                                {
                                                  ...actionDetails,
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
                                  ...(selectedObjectType &&
                                  actionType !== AutomationActionActionType.ARCHIVE_OBJECT
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
                                                (actionType ===
                                                AutomationActionActionType.SET_PROPERTY
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
                                              setValue(
                                                'actionDetails',
                                                {
                                                  ...actionDetails,
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
                                                    setValue(
                                                      'actionDetails',
                                                      {
                                                        ...actionDetails,
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
                                                  value: actionDetails?.entityId
                                                    ? getSetAsOptions().filter(
                                                        (o) =>
                                                          o.value.captureProperty ===
                                                            actionDetails.captureProperty &&
                                                          o.value.entityType ===
                                                            actionDetails.entityType,
                                                      )
                                                    : null,
                                                  isSearchable: false,
                                                  placeholder: 'Select Set As',
                                                  isDisabled: isReadOnly,
                                                  onChange: (_option: any) => {
                                                    setValue(
                                                      'actionDetails',
                                                      {
                                                        ...actionDetails,
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
                    actionDetails?.propertyInputType,
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
                                setValue(
                                  'actionDetails',
                                  {
                                    ...actionDetails,
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
                              defaultValue: actionDetails?.value,
                              disabled: isReadOnly,
                              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                setValue(
                                  'actionDetails',
                                  {
                                    ...actionDetails,
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
                {!isReadOnly && (
                  <div className="section-right-buttons-container">
                    <Button variant="secondary" disabled={!isDirty || !isValid} type="submit">
                      <AddIcon />
                      Add
                    </Button>
                    <Button
                      // className="check-save"
                      variant="primary"
                      disabled={
                        allowEditSave ? false : actions?.length === task?.automations?.length
                      }
                      onClick={() => {
                        dispatch(
                          addMultipleTaskAction({
                            taskId: task.id,
                            actions,
                          }),
                        );
                      }}
                    >
                      Save All
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ConfigureCheck;
