import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import ActivityList from '../../../ActivityList';
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

const TaskCard: FC<TaskCardProps> = ({ task, isActive }) => {
  const dispatch = useDispatch();

  const canSkipTask = !task.activities.reduce((acc, activity) => {
    acc = acc || activity.mandatory;
    return acc;
  }, false);

  return (
    <Wrapper
      onClick={() => {
        if (!isActive) {
          dispatch(setActiveTask(task.id));
        }
      }}
    >
      <Header task={task} />

      <ActivityList activities={task.activities} />

      <Footer canSkipTask={canSkipTask} />
    </Wrapper>
  );
};

export default TaskCard;
