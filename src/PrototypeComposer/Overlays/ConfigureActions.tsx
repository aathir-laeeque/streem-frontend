import { BaseModal, Button1, formatOptionLabel, FormGroup } from '#components';
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
import { apiGetObjectTypes, apiGetResourceActivitiesByType } from '#utils/apiUrls';
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
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [resourceActivities, setResourceActivities] = useState<any>([]);
  const [numberActivities, setNumberActivities] = useState<any>([]);
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
      fetchActivities();
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
          : AutomationTargetEntityType.RESOURCE_ACTIVITY,
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

  const fetchActivities = async () => {
    if (!resourceActivities.length && !numberActivities.length) {
      setIsLoadingActivities(true);
      const [resources, numbers] = await Promise.all([
        request('GET', apiGetResourceActivitiesByType(checklistId, 'RESOURCE')),
        request('GET', apiGetResourceActivitiesByType(checklistId, 'NUMBER')),
      ]);
      if (
        task.automations.length &&
        task.automations[0].actionType !== AutomationActionActionType.CREATE_OBJECT
      ) {
        const _selectedResource = resources.data.find(
          (r: any) => r.id === task.automations[0]?.actionDetails?.referencedActivityId,
        );
        if (_selectedResource) {
          fetchObjectType(_selectedResource.data.objectTypeId);
        }
      }
      setResourceActivities(resources.data);
      setNumberActivities(numbers.data);
      setIsLoadingActivities(false);
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
              'activityId',
              'propertyId',
              'propertyInputType',
              'propertyExternalId',
              'propertyDisplayName',
              'referencedActivityId',
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
                      } else if (!resourceActivities.length) {
                        fetchActivities();
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
                                isLoading: isLoadingActivities,
                                options: resourceActivities.map((resource: any) => ({
                                  ...resource.data,
                                  label: resource.label,
                                  value: resource.id,
                                })),
                                value: actionDetails?.referencedActivityId
                                  ? [
                                      {
                                        label: resourceActivities.find(
                                          (resource: any) =>
                                            resource.id === actionDetails.referencedActivityId,
                                        )?.label,
                                        value: actionDetails.referencedActivityId,
                                      },
                                    ]
                                  : undefined,
                                isSearchable: false,
                                placeholder: 'Select Resource Parameter',
                                onChange: (_option: any) => {
                                  setValue(
                                    'actionDetails',
                                    {
                                      referencedActivityId: _option.value,
                                      activityId: actionDetails?.activityId,
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
                                id: 'numberActivity',
                                formatOptionLabel,
                                label: 'Number Parameter',
                                isLoading: isLoadingActivities,
                                options: numberActivities.map((number: any) => ({
                                  label: number.label,
                                  value: number.id,
                                })),
                                value: actionDetails?.activityId
                                  ? [
                                      {
                                        label: numberActivities.find(
                                          (number: any) => number.id === actionDetails.activityId,
                                        )?.label,
                                        value: actionDetails.activityId,
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
                                      activityId: _option.value,
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
                                      options: selectedObjectType?.properties.reduce<
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
              <Button1 variant="secondary" color="red" onClick={closeOverlay}>
                Cancel
              </Button1>
              <Button1 disabled={!isDirty || !isValid} type="submit">
                Confirm
              </Button1>
              {task.automations.length > 0 && (
                <Button1
                  variant="primary"
                  color="red"
                  onClick={archiveAction}
                  style={{ marginLeft: 'auto' }}
                >
                  Delete
                </Button1>
              )}
            </div>
          </form>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ConfigureActions;
