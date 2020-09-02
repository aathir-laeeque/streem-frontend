import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import ActivityList from '../../../ActivityList';
import { JobStatus } from '../../../types';
import { setActiveTask } from '../../actions';
import {
  TaskCardProps,
  TaskExecutionStatus,
  StartedTaskStates,
} from '../../types';
import Footer from './Footer';
import Header from './Header';
import { ActivityType } from '#Composer/checklist.types';

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
  const { jobStatus } = useTypedSelector((state) => state.composer);
  const dispatch = useDispatch();

  const canSkipTask = !task.activities.reduce((acc, activity) => {
    if (
      activity.type === ActivityType.INSTRUCTION ||
      activity.type === ActivityType.MATERIAL
    ) {
      return acc;
    }

    acc = acc || activity.mandatory;
    return acc;
  }, false);

  const isTaskStarted = task.taskExecution.status in StartedTaskStates;

  console.log('isTaskStarted LL ', isTaskStarted);

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
        activities={task.activities}
        isTaskStarted={isTaskStarted}
      />

      <Footer canSkipTask={canSkipTask} task={task} />
    </Wrapper>
  );
};

export default TaskCard;
