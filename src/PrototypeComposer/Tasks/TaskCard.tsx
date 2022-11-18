import { NestedSelect, ImageUploadButton, Textarea } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  EnabledStates,
  MandatoryParameter,
  NonMandatoryParameter,
  TargetEntityType,
  TimerOperator,
} from '#PrototypeComposer/checklist.types';
import ParameterTaskView from '#PrototypeComposer/Parameters/TaskViews';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { useTypedSelector } from '#store/helpers';
import { apiGetParameters, apiMapParameterToTask } from '#utils/apiUrls';
import { DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDuration } from '#utils/timeUtils';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  AddCircleOutline,
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
  Autorenew,
  DeleteOutlined,
  PanTool,
  PanToolOutlined,
  PermMedia,
  PermMediaOutlined,
  Timer,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewParameterSuccess, toggleNewParameter } from '../Activity/actions';
import { Checklist } from '../checklist.types';
import {
  addStop,
  deleteTask,
  removeStop,
  reOrderParameters,
  reOrderTask,
  setActiveTask,
  updateTaskName,
} from './actions';
import { TaskCardWrapper, AddParameterItemWrapper } from './styles';
import { TaskCardProps } from './types';

const AddParameter = () => {
  return (
    <AddParameterItemWrapper>
      <div className="label">
        <AddCircleOutline /> Add Parameter
      </div>
      <ArrowDropDown />
    </AddParameterItemWrapper>
  );
};

const TaskCard: FC<TaskCardProps & { isFirstTask: boolean; isLastTask: boolean }> = ({
  task,
  index,
  isFirstTask,
  isLastTask,
  isActive,
}) => {
  const {
    data,
    parameters: { parameterOrderInTaskInStage, listById },
    stages: { activeStageId, listOrder },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const stageIndex = listOrder.indexOf(activeStageId as string);

  const { userId } = useTypedSelector((state) => ({
    userId: state.auth.userId,
  }));

  const dispatch = useDispatch();

  const [isAuthor, setIsAuthor] = useState(false);

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
  } = task;

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

  useEffect(() => {
    setIsAuthor(
      (data as Checklist)?.collaborators?.some(
        (collaborator) =>
          (collaborator.type === CollaboratorType.PRIMARY_AUTHOR ||
            collaborator.type === CollaboratorType.AUTHOR) &&
          collaborator.id === userId,
      ),
    );
  }, []);

  const onChildChange = async (option: any) => {
    switch (option.value) {
      case 'add-new-parameter':
        dispatch(toggleNewParameter({ action: 'task', title: 'Create a New Process Parameter' }));
        break;
      case 'add-text':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Instruction',
            type: NonMandatoryParameter.INSTRUCTION,
          }),
        );
        break;
      case 'add-material':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Instruction',
            type: NonMandatoryParameter.MATERIAL,
          }),
        );
        break;
      case 'subtasks':
        dispatch(
          toggleNewParameter({
            action: 'task',
            title: 'Create a New Subtask',
            type: MandatoryParameter.CHECKLIST,
          }),
        );
        break;
      default:
        if (activeStageId && activeTaskId) {
          const parametersInTask = parameterOrderInTaskInStage[activeStageId][taskId];
          const maxOrderTree =
            listById?.[parametersInTask?.[parametersInTask?.length - 1]]?.orderTree ?? 0;
          const response: ResponseObj<any> = await request(
            'PATCH',
            apiMapParameterToTask(data!.id, activeTaskId),
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
                taskId: activeTaskId,
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

  const noParameterError = task.errors.find((error) => error.code === 'E211') ?? undefined;

  if (activeStageId) {
    const taskParameters = parameterOrderInTaskInStage[activeStageId][taskId];
    const hasMedias = !!medias.length;

    return (
      <TaskCardWrapper
        isTimed={timed}
        hasMedias={hasMedias}
        hasStop={hasStop}
        isActive={isActive}
        onClick={() => {
          if (activeTaskId !== taskId) {
            dispatch(setActiveTask(taskId));
          }
        }}
      >
        <div
          className={`overlap ${
            isAuthor && data!.state in EnabledStates && !data?.archived ? 'hide' : ''
          }`}
          onClick={() => {
            if (activeTaskId === taskId) {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.EDITING_DISABLED,
                  props: { state: data?.state, archived: data?.archived },
                }),
              );
            }
          }}
        />
        <div className="task-header">
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

          <div className="task-name">
            Task {stageIndex + 1}.{index + 1}
          </div>

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
        </div>
        <div className="task-body">
          <div className="task-config">
            <Textarea
              defaultValue={name}
              error={!task.name && task.errors.find((error) => error.code === 'E210')?.message}
              label="Name the task"
              onChange={debounce(({ value }) => {
                dispatch(updateTaskName({ id: taskId, name: value }));
              }, 500)}
            />

            <div className="task-config-control">
              <div
                className="task-config-control-item"
                id="timed"
                onClick={() =>
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
                  label="Attach Media"
                  icon={hasMedias ? PermMedia : PermMediaOutlined}
                />
              </div>
              <div
                className="task-config-control-item"
                id="add-stop"
                onClick={() => {
                  if (hasStop) {
                    dispatch(removeStop(taskId));
                  } else {
                    dispatch(addStop(taskId));
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
              <div
                className="task-config-control-item"
                id="add-actions"
                onClick={() => {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.CONFIGURE_ACTIONS,
                      props: {
                        task,
                        checklistId: data?.id,
                      },
                    }),
                  );
                }}
              >
                <div>
                  <Autorenew className="icon" />
                  Configure Actions
                </div>
              </div>
            </div>
          </div>

          {hasMedias && (
            <div className="media-list">
              <ArrowLeft className="icon" />

              <div className="media-list-items">
                {medias.map((media, index) => (
                  <div
                    className="media-list-item"
                    key={index}
                    onClick={() => {
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
                    style={{
                      background: `url(${media.link}) center/cover no-repeat`,
                    }}
                  >
                    <div className="media-list-item-name">{media.name}</div>
                  </div>
                ))}
              </div>

              <ArrowRight className="icon" />
            </div>
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
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {noParameterError ? <div className="task-error">{noParameterError?.message}</div> : null}

        <div className="task-footer">
          <NestedSelect
            id="add-parameter-selector"
            width="100%"
            label={AddParameter}
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
                                page: pageNumber + 1,
                                size: DEFAULT_PAGE_SIZE,
                                filters: JSON.stringify({
                                  op: FilterOperators.AND,
                                  fields: [
                                    {
                                      field: 'targetEntityType',
                                      op: FilterOperators.EQ,
                                      values: [TargetEntityType.UNMAPPED],
                                    },
                                    { field: 'archived', op: FilterOperators.EQ, values: [false] },
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
                                }),
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
              subtasks: {
                label: 'Subtasks',
              },
            }}
            onChildChange={onChildChange}
          />
        </div>
      </TaskCardWrapper>
    );
  }
  return null;
};

export default TaskCard;
