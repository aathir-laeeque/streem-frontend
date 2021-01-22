import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import ActivityList from '#JobComposer/ActivityList';
import {
  CompletedTaskStates,
  MandatoryActivity,
  StartedTaskStates,
  TaskExecutionState,
} from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import {
  CompletedJobStates,
  JobStateEnum,
} from '#views/Jobs/NewListView/types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setActiveTask } from '../../actions';
import { TaskCardProps } from '../../types';
import Footer from './Footer';
import Header from './Header';

const Wrapper = styled.div.attrs({
  className: 'task-card',
})`
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
  display: flex;
  flex-direction: column;
  grid-area: task-card;
  height: max-content;

  :hover {
    box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
  }
`;

const TaskCard: FC<TaskCardProps> = ({ task, isActive, enableStopForTask }) => {
  const {
    jobState,
    activities: { activitiesById, activitiesOrderInTaskInStage },
    stages: { activeStageId },
  } = useTypedSelector((state) => state.composer);

  const { state: taskState, reason } = task.taskExecution;

  const dispatch = useDispatch();

  if (activeStageId) {
    const activities = activitiesOrderInTaskInStage[activeStageId][task.id].map(
      (activityId) => activitiesById[activityId],
    );

    const { canSkipTask, activitiesHasError } = activities.reduce(
      ({ canSkipTask, activitiesHasError }, activity) => {
        activitiesHasError ||= activity.hasError;

        if (activity.type in MandatoryActivity) {
          canSkipTask ||= activity.mandatory;
        }

        return { activitiesHasError, canSkipTask: canSkipTask };
      },
      { canSkipTask: false, activitiesHasError: false },
    );

    const isTaskStarted = taskState in StartedTaskStates;

    const isTaskDelayed = taskState === TaskExecutionState.COMPLETED && reason;

    const isTaskCompleted =
      taskState === TaskExecutionState.COMPLETED ||
      taskState === TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
      taskState === TaskExecutionState.COMPLETED_WITH_CORRECTION;

    const isCompletedWithException =
      taskState === TaskExecutionState.COMPLETED_WITH_EXCEPTION;

    const showStartButton =
      (jobState === JobStateEnum.ASSIGNED ||
        jobState === JobStateEnum.IN_PROGRESS) &&
      !isTaskStarted;

    const showAssignmentButton =
      !(taskState in CompletedTaskStates) &&
      !(jobState in CompletedJobStates) &&
      location.pathname.split('/')[1] !== 'inbox';

    const isCorrectingError =
      taskState === TaskExecutionState.ENABLED_FOR_CORRECTION;

    const isJobStarted =
      jobState === JobStateEnum.IN_PROGRESS ||
      jobState === JobStateEnum.BLOCKED;

    return (
      <Wrapper
        onClick={() => {
          if (!isActive) {
            dispatch(setActiveTask(task.id));
          }
          if (!isJobStarted && !showAssignmentButton) {
            dispatch(
              openOverlayAction({
                type: OverlayNames.START_JOB_MODAL,
                props: {},
              }),
            );
          }
        }}
      >
        <Header
          task={task}
          showStartButton={showStartButton}
          isTaskStarted={isTaskStarted}
          isTaskDelayed={!!isTaskDelayed}
          enableStopForTask={enableStopForTask}
          showAssignmentButton={showAssignmentButton}
        />
        <div
          onClick={() => {
            if (isJobStarted && !isTaskStarted) {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.START_TASK_ERROR_MODAL,
                }),
              );
            }
          }}
        >
          <ActivityList
            activities={activities}
            isTaskStarted={isTaskStarted}
            isTaskCompleted={isTaskCompleted}
            isCompletedWithException={isCompletedWithException}
            isCorrectingError={isCorrectingError}
          />
        </div>

        <Footer
          canSkipTask={!canSkipTask}
          task={task}
          activitiesHasError={activitiesHasError}
        />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default TaskCard;
