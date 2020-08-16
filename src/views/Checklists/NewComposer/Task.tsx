import React, { FC } from 'react';
import styled from 'styled-components';

import { Task as TaskType } from './checklist.types';
import Header from './Task.header';

const Wrapper = styled.div.attrs({
  className: 'task',
})`
  background-color: #ffff;
  border: 1px solid transparent;
  border-radius: 5px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);

  display: grid;
  grid-template-areas: 'header' 'task-content' 'completion-buttons';
  height: max-content;
  padding: 24px 16px;

  &.active {
    border-color: #1d84ff;
  }

  &-content {
    grid-area: task-content;
  }

  &-completion-buttons {
    grid-area: completion-buttons;
  }
`;

const Task: FC<{ task: TaskType; index: number; isActive: boolean }> = ({
  task,
  index,
  isActive,
}) => {
  return (
    <Wrapper className={`${isActive ? ' active' : ''}`}>
      <Header task={task} index={index} />

      <div className="task-content">Task Content</div>

      <div className="task-completion-buttons">Task Completion Buttons</div>
    </Wrapper>
  );
};

export default Task;
