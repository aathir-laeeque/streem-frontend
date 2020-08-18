import { useTypedSelector } from '#store/helpers';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Task } from '../checklist.types';
import TaskView from './TaskView';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'stagenumber' 'stagename' 'steps';
  grid-template-rows: 16px 32px 1fr;
  grid-area: steplist;
  overflow: hidden;
  padding: 24px 0 0 16px;

  .stage {
    &-number {
      grid-area: stagenumber;
      color: #666666;
      font-size: 12px;
      display: flex;
      align-items: center;
      cursor: default;
    }

    &-name {
      grid-area: stagename;
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      margin-top: 4px;
      display: flex;
      align-items: center;
      cursor: default;
    }
  }

  .tasks-list {
    &-container {
      grid-area: steps;
      list-style: none;
      margin: 0;
      margin-top: 16px;
      overflow: auto;
      padding: 0;
    }

    &-item {
      margin-bottom: 24px;
    }
  }
`;

const TaskListView: FC = () => {
  const {
    stages: { activeStage },
    tasks: { list },
  } = useTypedSelector((state) => state.newComposer);

  return (
    <Wrapper>
      <span className="stage-number">Stage {activeStage?.orderTree}</span>
      <span className="stage-name">{activeStage?.name}</span>

      <ul className="tasks-list-container">
        {(list as Array<Task>).map((task, index) => (
          <li key={index} className="tasks-list-item">
            <TaskView task={task} />
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default TaskListView;
