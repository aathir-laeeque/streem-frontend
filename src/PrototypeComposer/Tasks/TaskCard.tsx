import ParameterTaskView from '#PrototypeComposer/Parameters/TaskViews';
import {
  MandatoryParameter,
  NonMandatoryParameter,
  TargetEntityType,
  TimerOperator,
} from '#PrototypeComposer/checklist.types';
import { ImageGallery, ImageUploadButton, NestedSelect, Textarea } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { apiGetParameters, apiMapParameterToTask } from '#utils/apiUrls';
import { isFeatureAllowed } from '#services/uiPermissions';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDuration } from '#utils/timeUtils';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  AddCircleOutline,
  ArrowDropDown,
  ArrowDropUp,
  Autorenew,
  DeleteOutlined,
  Error as ErrorIcon,
  PanTool,
  PanToolOutlined,
  PermMedia,
  PermMediaOutlined,
  Timer,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewParameterSuccess, toggleNewParameter } from '../Activity/actions';
import DynamicTaskDrawer from './DynamicTaskDrawer';
import {
  addStop,
  deleteTask,
  reOrderParameters,
  reOrderTask,
  removeStop,
  setActiveTask,
  updateTaskName,
} from './actions';
import { AddActivityItemWrapper, TaskCardWrapper } from './styles';
import { TaskCardProps, TaskTypeEnum } from './types';
import TaskRecurrence from '#assets/svg/TaskRecurrence';
import ScheduleTask from '#assets/svg/ScheduleTask';
import TaskInterlocks from '#assets/svg/TaskInterlocks';

const AddActivity = () => {
  return (
    <AddActivityItemWrapper>
      <div className="label">
        <AddCircleOutline /> Add Activity
      </div>
      <ArrowDropDown />
    </AddActivityItemWrapper>
  );
};

const TaskCard: FC<
  TaskCardProps & { isFirstTask: boolean; isLastTask: boolean; isReadOnly: boolean }
> = ({ task, index, isFirstTask, isLastTask, isActive, isReadOnly }) => {
  const dispatch = useDispatch();
  const {
    data,
    parameters: { parameterOrderInTaskInStage, listById },
    stages: { activeStageId, listOrder },
    tasks: { activeTaskId },
    errors: checklistErrors,
  } = useTypedSelector((state) => state.prototypeComposer);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const stageIndex = listOrder.indexOf(activeStageId as string);

  const sensors = useSensors(useSensor(PointerSensor));

  const {
    id: taskId,
    hasStop,
    maxPeriod = 0,
    medias,
    minPeriod = 0,
    name,
    timed,
    timerOperator,
    automations,
    enableScheduling,
    enableRecurrence,
    interlocks,
  } = task;

  const taskConditions = interlocks?.validations?.resourceParameterValidations?.length || 0;

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (data?.id && activeStageId && over && active.id !== over.id) {
      const taskParameters = parameterOrderInTaskInStage[activeStageId][taskId];
      const oldIndex = taskParameters.indexOf(active.id as string);
      const newIndex = taskParameters.indexOf(over.id as string);
      dispatch(
        reOrderParameters({
          checklistId: data.id,
          stageId: activeStageId,
          taskId,
          orderedIds: arrayMove(taskParameters, oldIndex, newIndex),
        }),
      );
    }
  };

  const onChildChange = async (option: any) => {
    switch (option.value) {
      case 'add-new-parameter':
        dispatch(
          toggleNewParameter({ action: 'task', title: 'Create a New Process Parameter', taskId }),
        );
        break;
      case 'add-text':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Instruction',
            type: NonMandatoryParameter.INSTRUCTION,
            taskId,
          }),
        );
        break;
      case 'add-material':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Instruction',
            type: NonMandatoryParameter.MATERIAL,
            taskId,
          }),
        );
        break;
      case 'checklist':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Checklist',
            type: MandatoryParameter.CHECKLIST,
            taskId,
          }),
        );
        break;
      default:
        if (activeStageId) {
          const parametersInTask = parameterOrderInTaskInStage[activeStageId][taskId];
          const maxOrderTree =
            listById?.[parametersInTask?.[parametersInTask?.length - 1]]?.orderTree ?? 0;
          const response: ResponseObj<any> = await request(
            'PATCH',
            apiMapParameterToTask(data!.id, taskId),
            {
              data: {
                parameterId: option.id,
                orderTree: maxOrderTree + 1,
              },
            },
          );
          if (response?.data) {
            dispatch(
              addNewParameterSuccess({
                parameter: response.data,
                stageId: activeStageId,
                taskId,
              }),
            );
            dispatch(
              showNotification({
                type: NotificationType.SUCCESS,
                msg: 'Parameter added',
                detail: response.data.label,
              }),
            );
          }
        }
        break;
    }
  };

  const deleteTaskProps = {
    header: 'Delete Task',
    body: <span>Are you sure you want to Delete this Task ? </span>,
    onPrimaryClick: () => dispatch(deleteTask(taskId)),
  };

  // E211 = 'TASK_SHOULD_HAVE_ATLEAST_ONE_EXECUTABLE_PARAMETER'
  const noParameterError =
    checklistErrors.find((error) => error.code === 'E211' && error.id === task.id) ?? undefined;

  // E225 = 'TASK_AUTOMATION_INVALID_MAPPED_PARAMETERS',
  const archiveParameterError = checklistErrors.find(
    (error) => error.code === 'E225' && error.id === task.id,
  );

  if (activeStageId) {
    const taskParameters = parameterOrderInTaskInStage[activeStageId][taskId];
    const hasMedias = !!medias.length;

    return (
      <TaskCardWrapper
        isTimed={timed}
        hasMedias={hasMedias}
        hasStop={hasStop}
        enableRecurrence={enableRecurrence}
        enableScheduling={enableScheduling}
        taskConditions={taskConditions}
        isActive={isActive}
        onClick={() => {
          if (activeTaskId !== taskId) {
            dispatch(setActiveTask(taskId));
          }
        }}
        isReadOnly={isReadOnly}
        hasError={!!archiveParameterError?.code}
      >
        <div className="task-header">
          {!isReadOnly && (
            <div className="order-control">
              <ArrowDropUp
                className="icon"
                fontSize="small"
                onClick={(event) => {
                  event.stopPropagation();
                  if (!isFirstTask) {
                    dispatch(
                      reOrderTask({
                        from: index,
                        to: index - 1,
                        id: taskId,
                        activeStageId: activeStageId,
                      }),
                    );
                  }
                }}
              />
              <ArrowDropDown
                className="icon"
                fontSize="small"
                onClick={(event) => {
                  event.stopPropagation();
                  if (!isLastTask) {
                    dispatch(
                      reOrderTask({
                        from: index,
                        to: index + 1,
                        id: taskId,
                        activeStageId: activeStageId,
                      }),
                    );
                  }
                }}
              />
            </div>
          )}

          <div className="task-name">
            Task {stageIndex + 1}.{index + 1}
          </div>
          {!isReadOnly && (
            <DeleteOutlined
              className="icon"
              id="task-delete"
              onClick={(event) => {
                event.stopPropagation();

                dispatch(
                  openOverlayAction({
                    type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
                    props: deleteTaskProps,
                  }),
                );
              }}
            />
          )}
        </div>
        <div className="task-body">
          <div className="task-config">
            {!!archiveParameterError?.code && (
              <div className="task-error-wrapper">
                <ErrorIcon className="task-error-icon" />
                {archiveParameterError.message}
              </div>
            )}

            <Textarea
              defaultValue={name}
              //E210 = 'TASK_NAME_CANNOT_BE_EMPTY',
              error={!task.name && task.errors.find((error) => error.code === 'E210')?.message}
              label={task.type === TaskTypeEnum.SUBPROCESS ? 'Process Name' : 'Name the task'}
              disabled={isReadOnly || task.type === TaskTypeEnum.SUBPROCESS}
              onChange={debounce(({ value }) => {
                dispatch(updateTaskName({ id: taskId, name: value }));
              }, 500)}
            />
            <div className="task-config-control">
              <>
                <div
                  className="task-config-control-item"
                  id="timed"
                  onClick={() =>
                    !isReadOnly &&
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.TIMED_TASK_CONFIG,
                        props: { maxPeriod, minPeriod, taskId, timerOperator },
                      }),
                    )
                  }
                >
                  <div>
                    <Timer className="icon" />
                    Timed
                  </div>
                  {timed ? (
                    <div className="timer-config">
                      {timerOperator === TimerOperator.LESS_THAN ? (
                        <>
                          <span>Complete Under</span>
                          <span>{formatDuration(maxPeriod)}</span>
                        </>
                      ) : (
                        <>
                          <span>NLT {formatDuration(minPeriod)}</span>
                          <span>Max: {formatDuration(maxPeriod)}</span>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="task-config-control-item" id="attach-media">
                  <ImageUploadButton
                    onUploadSuccess={(fileData) => {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.TASK_MEDIA,
                          props: {
                            mediaDetails: {
                              ...fileData,
                              name: '',
                              description: '',
                            },
                            taskId: taskId,
                          },
                        }),
                      );
                    }}
                    onUploadError={(error) => {
                      console.error('error in fileUpload :: ', error);
                    }}
                    acceptedTypes={['image/*', '.png', '.jpg', '.jpeg']}
                    label="Attach Media"
                    icon={hasMedias ? PermMedia : PermMediaOutlined}
                    disabled={isReadOnly}
                  />
                </div>
                <div
                  className="task-config-control-item"
                  id="add-stop"
                  onClick={() => {
                    if (!isReadOnly) {
                      if (hasStop) {
                        dispatch(removeStop(taskId));
                      } else {
                        dispatch(addStop(taskId));
                      }
                    }
                  }}
                >
                  <div>
                    {hasStop ? (
                      <>
                        <PanTool className="icon" /> Stop Added
                      </>
                    ) : (
                      <>
                        <PanToolOutlined className="icon" /> Add Stop
                      </>
                    )}
                  </div>
                </div>
              </>
              <div
                className="task-config-control-item"
                id="add-actions"
                onClick={() => {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.CONFIGURE_ACTIONS,
                      props: {
                        checklistId: data?.id,
                        isReadOnly,
                      },
                    }),
                  );
                }}
              >
                <div>
                  <Autorenew className="icon" />
                  Configure Actions {automations.length > 0 && `(${automations.length})`}
                </div>
              </div>
              {isFeatureAllowed('recurringTask') && (
                <div
                  className="task-config-control-item"
                  id="task-recurrence"
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.TASK_RECURRENCE_MODAL,
                        props: {
                          task,
                          isReadOnly,
                        },
                      }),
                    );
                  }}
                >
                  <div>
                    <TaskRecurrence className="icon" />
                    Task Recurrence
                  </div>
                </div>
              )}
              {isFeatureAllowed('scheduleTask') && (
                <div
                  className="task-config-control-item"
                  id="schedule-task"
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.SCHEDULE_TASK_MODAL,
                        props: {
                          task,
                          isReadOnly,
                        },
                      }),
                    );
                  }}
                >
                  <div>
                    <ScheduleTask className="icon" />
                    Schedule Task
                  </div>
                </div>
              )}
              <div
                className="task-config-control-item"
                id="add-interlocks"
                onClick={() => {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.CONFIGURE_TASK_CONDITIONS,
                      props: {
                        checklistId: data?.id,
                        isReadOnly,
                      },
                    }),
                  );
                }}
              >
                <div>
                  <TaskInterlocks className="icon" />
                  Configure Conditions {taskConditions > 0 ? `(${taskConditions})` : null}
                </div>
              </div>
            </div>
          </div>

          {hasMedias && (
            <ImageGallery
              medias={medias}
              onClickHandler={(media) => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.TASK_MEDIA,
                    props: {
                      taskId,
                      mediaDetails: media,
                      disableNameInput: false,
                      disableDescInput: false,
                    },
                  }),
                );
              }}
            />
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={taskParameters} strategy={verticalListSortingStrategy}>
              <div className="parameter-list">
                {taskParameters?.map((parameterId, index) => {
                  const parameter = listById[parameterId];
                  return (
                    <ParameterTaskView
                      parameter={parameter}
                      key={`${parameterId}-${index}`}
                      taskId={taskId}
                      isReadOnly={isReadOnly}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {noParameterError ? <div className="task-error">{noParameterError?.message}</div> : null}
        {!isReadOnly && (
          <div className="task-footer">
            <NestedSelect
              id="add-parameter-selector"
              width="100%"
              label={AddActivity}
              items={{
                parameters: {
                  label: 'Parameters',
                  items: {
                    'add-new-parameter': {
                      label: 'Add New',
                    },
                    'existing-parameter': {
                      label: 'Choose from Existing',
                      fetchItems: async (pageNumber?: number, query = '') => {
                        if (typeof pageNumber === 'number') {
                          try {
                            const { data: resData, pageable }: ResponseObj<any[]> = await request(
                              'GET',
                              apiGetParameters(data!.id),
                              {
                                params: {
                                  page: pageNumber,
                                  sort: 'createdAt,desc',
                                  size: DEFAULT_PAGE_SIZE,
                                  filters: {
                                    op: FilterOperators.AND,
                                    fields: [
                                      {
                                        field: 'targetEntityType',
                                        op: FilterOperators.EQ,
                                        values: [TargetEntityType.UNMAPPED],
                                      },
                                      {
                                        field: 'archived',
                                        op: FilterOperators.EQ,
                                        values: [false],
                                      },
                                      ...(query
                                        ? [
                                            {
                                              field: 'label',
                                              op: FilterOperators.LIKE,
                                              values: [query],
                                            },
                                          ]
                                        : []),
                                    ],
                                  },
                                },
                              },
                            );
                            if (resData && pageable) {
                              return {
                                options: resData.map((item) => ({
                                  ...item,
                                  value: item.id,
                                })),
                                pageable,
                              };
                            }
                          } catch (e) {
                            console.error('Error while fetching existing unmapped parameters', e);
                          }
                        }
                        return {
                          options: [],
                        };
                      },
                    },
                  },
                },
                instructions: {
                  label: 'Instruction',
                  items: {
                    'add-text': {
                      label: 'Add Text',
                    },
                    'add-material': {
                      label: 'Add Material',
                    },
                  },
                },
                checklist: {
                  label: 'Checklist',
                },
              }}
              popOutProps={{ filterOption: () => true }}
              onChildChange={onChildChange}
            />
          </div>
        )}
        {isDrawerOpen && <DynamicTaskDrawer onCloseDrawer={setIsDrawerOpen} />}
      </TaskCardWrapper>
    );
  }
  return null;
};

export default TaskCard;
