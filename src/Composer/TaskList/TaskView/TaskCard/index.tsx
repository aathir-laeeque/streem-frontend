import ActivityList from '#Composer/ActivityList';
import { ActivityType } from '#Composer/checklist.types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { JobStatus } from '../../../types';
import { setActiveTask } from '../../actions';
import {
  StartedTaskStates,
  TaskCardProps,
  TaskExecutionStatus,
} from '../../types';
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

const TaskCard: FC<TaskCardProps> = ({ task, isActive }) => {
  const {
    jobStatus,
    activeStageId,
    activitiesOrderInTaskInStage,
    activitiesById,
  } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  const activities = activitiesOrderInTaskInStage[activeStageId][task.id].map(
    (activityId) => activitiesById[activityId],
  );

  const canSkipTask = !activities.reduce((acc, activity) => {
    if (
      activity.type === ActivityType.INSTRUCTION ||
      activity.type === ActivityType.MATERIAL
    ) {
      return acc;
    }

    acc = acc || activity.mandatory;
    return acc;
  }, false);

  const activitiesHasError = activities.reduce((acc, activity) => {
    return acc || !!activity.hasError;
  }, false);

  const isTaskStarted = task.taskExecution.status in StartedTaskStates;

  const isTaskCompleted =
    task.taskExecution.status === TaskExecutionStatus.COMPLETED;

  const showStartButton =
    (jobStatus === JobStatus.ASSIGNED || jobStatus === JobStatus.INPROGRESS) &&
    !isTaskStarted;

  return (
    <Wrapper
      onClick={() => {
        if (!isActive) {
          dispatch(setActiveTask(task.id));
        }
      }}
    >
      <Header task={task} showStartButton={showStartButton} />

      <ActivityList
        activities={activities}
        isTaskStarted={isTaskStarted}
        isTaskCompleted={isTaskCompleted}
      />

      <Footer
        canSkipTask={canSkipTask}
        task={task}
        activitiesHasError={activitiesHasError}
      />
    </Wrapper>
  );
};

export default TaskCard;
