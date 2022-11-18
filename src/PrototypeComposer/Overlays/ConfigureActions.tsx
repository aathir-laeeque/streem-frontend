import { BaseModal, Button, formatOptionLabel, FormGroup } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import {
  AutomationActionActionType,
  AutomationActionDetails,
  AutomationActionTriggerType,
  AutomationActionType,
  AutomationTargetEntityType,
} from '#JobComposer/checklist.types';
import {
  addTaskAction,
  archiveTaskAction,
  updateTaskAction,
} from '#PrototypeComposer/Tasks/actions';
import { Task } from '#PrototypeComposer/Tasks/types';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetParameters } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { ObjectType } from '#views/Ontology/types';
import { startCase, toLower } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

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

    .form-group {
      min-height: 180px;
    }

    .buttons-container {
      display: flex;
      padding: 0 16px 16px;
    }
  }
`;

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
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [resourceParameters, setResourceParameters] = useState<any>([]);
  const [numberParameters, setNumberParameters] = useState<any>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: task.automations.length
      ? {
          actionType: task.automations[0].actionType,
          actionDetails: task.automations[0].actionDetails,
        }
      : undefined,
  });

  useEffect(() => {
    if (task.automations.length) {
      fetchParameters();
    }
  }, []);

  const actionType = watch('actionType');
  const actionDetails = watch('actionDetails');

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
    if (task.automations.length) {
      dispatch(
        updateTaskAction({
          actionId: task.automations[0].id,
          taskId: task.id,
          action: {
            ...data,
            ...commonData,
          },
        }),
      );
    } else {
      dispatch(
        addTaskAction({
          taskId: task.id,
          action: {
            ...data,
            ...commonData,
          },
        }),
      );
    }
  };

  const fetchParameters = async () => {
    if (!resourceParameters.length && !numberParameters.length) {
      setIsLoadingParameters(true);
      const [resources, numbers] = await Promise.all([
        request('GET', apiGetParameters(checklistId, 'RESOURCE')),
        request('GET', apiGetParameters(checklistId, 'NUMBER')),
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

  register('actionType', {
    required: true,
  });

  register('actionDetails', {
    required: true,
    validate: {
      isValid: (v) => {
        if (actionType) {
          if (actionType !== AutomationActionActionType.CREATE_OBJECT) {
            return [
              'parameterId',
              'propertyId',
              'propertyInputType',
              'propertyExternalId',
              'propertyDisplayName',
              'referencedParameterId',
            ].every((key) => !!v?.[key]);
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
        title="Configure Actions"
        showFooter={false}
      >
        <div className="body">
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    value: actionType
                      ? [
                          {
                            label: startCase(toLower(actionType)),
                            value: actionType,
                          },
                        ]
                      : undefined,
                    onChange: (_option: { value: string }) => {
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
                                formatOptionLabel,
                                label: 'Object Type',
                                isLoading: listLoading,
                                options: list.map((objectType) => ({
                                  ...objectType,
                                  label: objectType.displayName,
                                  value: objectType.id,
                                })),
                                value: actionDetails?.objectTypeId
                                  ? [
                                      {
                                        label: actionDetails.objectTypeDisplayName,
                                        value: actionDetails.objectTypeId,
                                      },
                                    ]
                                  : undefined,
                                isSearchable: false,
                                placeholder: 'Select Object Type',
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
                                formatOptionLabel,
                                label: 'Resource Parameter',
                                isLoading: isLoadingParameters,
                                options: resourceParameters.map((resource: any) => ({
                                  ...resource.data,
                                  label: resource.label,
                                  value: resource.id,
                                })),
                                value: actionDetails?.referencedParameterId
                                  ? [
                                      {
                                        label: resourceParameters.find(
                                          (resource: any) =>
                                            resource.id === actionDetails.referencedParameterId,
                                        )?.label,
                                        value: actionDetails.referencedParameterId,
                                      },
                                    ]
                                  : undefined,
                                isSearchable: false,
                                placeholder: 'Select Resource Parameter',
                                onChange: (_option: any) => {
                                  setValue(
                                    'actionDetails',
                                    {
                                      referencedParameterId: _option.value,
                                      parameterId: actionDetails?.parameterId,
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
                            {
                              type: InputTypes.SINGLE_SELECT,
                              props: {
                                id: 'numberParameter',
                                formatOptionLabel,
                                label: 'Number Parameter',
                                isLoading: isLoadingParameters,
                                options: numberParameters.map((number: any) => ({
                                  label: number.label,
                                  value: number.id,
                                })),
                                value: actionDetails?.parameterId
                                  ? [
                                      {
                                        label: numberParameters.find(
                                          (number: any) => number.id === actionDetails.parameterId,
                                        )?.label,
                                        value: actionDetails.parameterId,
                                      },
                                    ]
                                  : undefined,
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
                            ...(selectedObjectType
                              ? [
                                  {
                                    type: InputTypes.SINGLE_SELECT,
                                    props: {
                                      id: 'objectProperty',
                                      formatOptionLabel,
                                      label: 'Object Property',
                                      isLoading: isLoadingObjectType,
                                      options: selectedObjectType?.properties?.reduce<
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
                                      value: actionDetails?.propertyId
                                        ? [
                                            {
                                              label: actionDetails.propertyDisplayName,
                                              value: actionDetails.propertyId,
                                            },
                                          ]
                                        : undefined,
                                      isSearchable: false,
                                      placeholder: 'Select Object Property',
                                      onChange: (_option: any) => {
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
                                      },
                                    },
                                  },
                                ]
                              : []),
                          ]),
                    ]
                  : []),
              ]}
            />
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

export default ConfigureActions;
