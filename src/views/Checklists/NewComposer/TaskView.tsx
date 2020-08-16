import React, { FC } from 'react';
import styled from 'styled-components';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';

import { Task as TaskType } from './checklist.types';
import Task from './Task';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'position-control task task-media';
  grid-template-columns: 24px 1.5fr 1fr;
  grid-column-gap: 16px;

  .position-control {
    grid-area: position-control;
    display: flex;
    flex-direction: column;

    span {
      align-self: center;
    }
  }

  .task-media {
    grid-area: task-media;
  }
`;

const TaskView: FC<{ task: TaskType; isActive: boolean; index: number }> = ({
  task,
  isActive,
  index,
}) => {
  return (
    <Wrapper>
      <div className="position-control">
        <ArrowUpwardOutlined className="icon icon-up" />

        <span className="step-number">{task.orderTree}</span>

        <ArrowDownwardOutlined className="icon icon-down" />
      </div>

      <Task task={task} isActive={isActive} index={index} />

      {isActive ? <div className="task-media">Task Media</div> : null}
    </Wrapper>
  );
};

export default TaskView;
