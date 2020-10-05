import { Select, TextInput } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ActivityType } from '#Composer-new/checklist.types';
import { useTypedSelector } from '#store/helpers';
import {
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
import { addStop, deleteTask, removeStop, setActiveTask } from './actions';
import { TaskCardWrapper } from './styles';
import { TaskCardProps } from './types';

const TaskCard: FC<TaskCardProps> = ({ task, index }) => {
  const {
    data,
    activities: { activityOrderInTaskInStage, listById },
    stages: { activeStageId },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);

  const dispatch = useDispatch();

  const deleteTaskProps = {
    header: 'Delete Task',
    body: (
      <>
        <span>Are you sure you want to Delete this Task ? </span>
      </>
    ),
    onPrimaryClick: () => dispatch(deleteTask(task.id)),
  };

  if (activeStageId) {
    const taskActivities = activityOrderInTaskInStage[activeStageId][task.id];

    return (
      <TaskCardWrapper
        isTimed={task.timed}
        hasMedias={!!task.medias.length}
        hasStop={task.hasStop}
        onClick={() => {
          if (activeTaskId !== task.id) {
            dispatch(setActiveTask(task.id));
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
            <TextInput
              defaultValue={task.name}
              label="Name the task"
              name="taskName"
              onChange={debounce(({ value }) => {
                console.log('value after change :: ', value);
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
                      props: {},
                    }),
                  )
                }
              >
                <Timer className="icon" />
                Timed
              </div>
              <div className="task-config-control-item" id="attach-media">
                <PermMedia className="icon" />
                Attach Media
              </div>
              <div
                className="task-config-control-item"
                id="add-stop"
                onClick={() => {
                  if (task.hasStop) {
                    dispatch(removeStop(task.id));
                  } else {
                    dispatch(addStop(task.id));
                  }
                }}
              >
                <PanTool className="icon" />
                Add Stop
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
                  taskId={task.id}
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
                  taskId: task.id,
                  stageId: activeStageId,
                  orderTree: taskActivities.length + 1,
                }),
              );
            }}
            placeHolder="Add Activity"
            persistValue={false}
          />
        </div>
      </TaskCardWrapper>
    );
  } else {
    return null;
  }
};

export default TaskCard;
