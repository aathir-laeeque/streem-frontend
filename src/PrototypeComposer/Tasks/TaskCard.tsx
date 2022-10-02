import { Select, ImageUploadButton, Textarea } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ActivityType, EnabledStates, TimerOperator } from '#PrototypeComposer/checklist.types';
import { CollaboratorType } from '#PrototypeComposer/reviewer.types';
import { useTypedSelector } from '#store/helpers';
import { formatDuration } from '#utils/timeUtils';
import {
  AddBox,
  ArrowDropDown,
  ArrowDropUp,
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
import Activity from '../Activity';
import { addNewActivity } from '../Activity/actions';
import { Checklist } from '../checklist.types';
import { ActivityOptions } from '../constants';
import {
  addStop,
  deleteTask,
  removeStop,
  reOrderTask,
  resetTaskActivityError,
  setActiveTask,
  updateTaskName,
} from './actions';
import { TaskCardWrapper } from './styles';
import { TaskCardProps } from './types';

const TaskCard: FC<TaskCardProps & { isFirstTask: boolean; isLastTask: boolean }> = ({
  task,
  index,
  isFirstTask,
  isLastTask,
  isActive,
}) => {
  const {
    data,
    activities: { activityOrderInTaskInStage, listById },
    stages: { activeStageId, listOrder },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);

  const { userId } = useTypedSelector((state) => ({
    userId: state.auth.userId,
  }));

  const dispatch = useDispatch();

  const [isAuthor, setIsAuthor] = useState(false);

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

  const stageIndex = listOrder.indexOf(activeStageId as string);

  const deleteTaskProps = {
    header: 'Delete Task',
    body: <span>Are you sure you want to Delete this Task ? </span>,
    onPrimaryClick: () => dispatch(deleteTask(taskId)),
  };

  const noActivityError = task.errors.find((error) => error.code === 'E211') ?? undefined;

  if (activeStageId) {
    const taskActivities = activityOrderInTaskInStage[activeStageId][taskId];
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
            isAuthor && data?.state in EnabledStates && !data?.archived ? 'hide' : ''
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

          <div className="activity-list">
            {taskActivities?.map((activityId, index) => {
              const activity = listById[activityId];
              return (
                <Activity activity={activity} key={`${activityId}-${index}`} taskId={taskId} />
              );
            })}
          </div>
        </div>

        {noActivityError ? <div className="task-error">{noActivityError?.message}</div> : null}

        <div className="task-footer">
          <Select
            options={ActivityOptions}
            onChange={(option: any) => {
              dispatch(resetTaskActivityError(taskId));
              dispatch(
                addNewActivity({
                  activityType: option.value as ActivityType,
                  checklistId: (data as Checklist).id,
                  taskId: taskId,
                  stageId: activeStageId,
                  orderTree: taskActivities.length + 1,
                }),
              );
            }}
            placeholder="Add Activity"
          />
        </div>
      </TaskCardWrapper>
    );
  } else {
    return null;
  }
};

export default TaskCard;
