import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { TaskCardProps } from './types';
import { setActiveTask } from './actions';

const Wrapper = styled.div.attrs({
  className: 'task-card',
})`
  grid-area: task-card;
`;

const TaskCard: FC<TaskCardProps> = ({ task, isActive }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper onClick={() => dispatch(setActiveTask(task.id))}>
      This is the task card
    </Wrapper>
  );
};

export default TaskCard;
