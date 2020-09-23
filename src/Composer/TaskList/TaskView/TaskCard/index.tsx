import ActivityList from '#Composer/ActivityList';
import {
  TaskExecutionStatus,
  StartedTaskStates,
} from '#Composer/checklist.types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { JobStatus } from '../../../composer.types';
import { setActiveTask } from '../../actions';
import { TaskCardProps } from '../../types';
import Footer from './Footer';
import Header from './Header';
import { MandatoryActivity } from '../../../checklist.types';

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
    jobStatus,
    activities: { activitiesById, activitiesOrderInTaskInStage },
    stages: { activeStageId },
  } = useTypedSelector((state) => state.composer);

  const { status: taskStatus, reason } = task.taskExecution;

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

        return { activitiesHasError, canSkipTask: !canSkipTask };
      },
      { canSkipTask: false, activitiesHasError: false },
    );

    const isTaskStarted = taskStatus in StartedTaskStates;

    const isTaskDelayed =
      taskStatus === TaskExecutionStatus.COMPLETED && reason;

    const isTaskCompleted =
      taskStatus === TaskExecutionStatus.COMPLETED ||
      taskStatus === TaskExecutionStatus.COMPLETED_WITH_EXCEPTION ||
      taskStatus === TaskExecutionStatus.COMPLETED_WITH_ERROR_CORRECTION;

    const isCompletedWithException =
      taskStatus === TaskExecutionStatus.COMPLETED_WITH_EXCEPTION;

    const showStartButton =
      (jobStatus === JobStatus.ASSIGNED ||
        jobStatus === JobStatus.INPROGRESS) &&
      !isTaskStarted;

    const isCorrectingError =
      taskStatus === TaskExecutionStatus.ENABLED_FOR_ERROR_CORRECTION;

    return (
      <Wrapper
        onClick={() => {
          if (!isActive) {
            dispatch(setActiveTask(task.id));
          }
        }}
      >
        <Header
          task={task}
          showStartButton={showStartButton}
          isTaskStarted={isTaskStarted}
          isTaskDelayed={!!isTaskDelayed}
          enableStopForTask={enableStopForTask}
        />

        <ActivityList
          activities={activities}
          isTaskStarted={isTaskStarted}
          isTaskCompleted={isTaskCompleted}
          isCompletedWithException={isCompletedWithException}
          isCorrectingError={isCorrectingError}
        />

        <Footer
          canSkipTask={canSkipTask}
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
