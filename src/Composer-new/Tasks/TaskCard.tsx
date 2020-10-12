import { Select, Textarea, ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ActivityType, TimerOperator } from '#Composer-new/checklist.types';
import { useTypedSelector } from '#store/helpers';
import {
  AddBox,
  ArrowDownward,
  ArrowUpward,
  Delete,
  PanTool,
  PermMedia,
  Timer,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import Activity from '../Activity';
import { addNewActivity } from '../Activity/actions';
import { Checklist } from '../checklist.types';
import { ActivityOptions } from '../constants';
import {
  addStop,
  deleteTask,
  removeStop,
  setActiveTask,
  updateTaskName,
} from './actions';
import { TaskCardWrapper } from './styles';
import { TaskCardProps } from './types';
import { formatDuration } from '#utils/timeUtils';

const TaskCard: FC<TaskCardProps> = ({ task, index }) => {
  const {
    data,
    activities: { activityOrderInTaskInStage, listById },
    stages: { activeStageId },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);

  const dispatch = useDispatch();

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

  const deleteTaskProps = {
    header: 'Delete Task',
    body: <span>Are you sure you want to Delete this Task ? </span>,
    onPrimaryClick: () => dispatch(deleteTask(taskId)),
  };

  if (activeStageId) {
    const taskActivities = activityOrderInTaskInStage[activeStageId][taskId];

    return (
      <TaskCardWrapper
        isTimed={timed}
        hasMedias={!!medias.length}
        hasStop={hasStop}
        onClick={() => {
          if (activeTaskId !== taskId) {
            dispatch(setActiveTask(taskId));
          }
        }}
      >
        <div className="task-header">
          <div className="order-control">
            <ArrowUpward
              className="icon"
              fontSize="small"
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <ArrowDownward
              className="icon"
              fontSize="small"
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          </div>

          <div className="task-name">Task {index + 1}</div>

          <Delete
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
                        type: OverlayNames.TASK_MEDIA_UPLOAD,
                        props: { fileData, taskId: taskId },
                      }),
                    );
                  }}
                  onUploadError={(error) => {
                    console.error('error in fileUpload :: ', error);
                  }}
                  label="Attach Media"
                  icon={PermMedia}
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
                  <PanTool className="icon" />
                  {hasStop ? 'Stop Added' : 'Add Stop'}
                </div>
              </div>
            </div>
          </div>

          <div className="activity-list">
            {taskActivities?.map((activityId, index) => {
              const activity = listById[activityId];

              return (
                <Activity
                  activity={activity}
                  key={`${activityId}-${index}`}
                  taskId={taskId}
                />
              );
            })}
          </div>
        </div>
        <div className="task-footer">
          <Select
            options={ActivityOptions}
            onChange={(option) => {
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
            placeHolder="Add Activity"
            persistValue={false}
            SelectButtonIcon={AddBox}
          />
        </div>
      </TaskCardWrapper>
    );
  } else {
    return null;
  }
};

export default TaskCard;
