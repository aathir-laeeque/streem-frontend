import { useTypedSelector } from '#store/helpers';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Task } from '../checklist.types';
import TaskView from './TaskView';

const Wrapper = styled.div`
  display: grid;
  grid-area: tasks-list-view;
  grid-template-areas: 'stage-number' 'stage-name' 'tasks-list';
  grid-template-rows: 16px 32px 1fr;
  overflow: hidden;
  padding: 24px 0 0 16px;

  .stage {
    &-number {
      align-items: center;
      color: #666666;
      cursor: default;
      display: flex;
      font-size: 12px;
      grid-area: stage-number;
    }

    &-name {
      align-items: center;
      color: #000000;
      cursor: default;
      display: flex;
      font-size: 24px;
      font-weight: bold;
      grid-area: stage-name;
      margin-top: 4px;
    }
  }

  .tasks-list {
    grid-area: tasks-list;
    list-style: none;
    margin: 0;
    margin-top: 16px;
    overflow: auto;
    padding: 0;
  }
`;

const TaskListView: FC = () => {
  const { tasksListMap, activeStage } = useTypedSelector(
    ({ newComposer: { stages, tasks } }) => ({
      tasksListMap: tasks.list,
      activeStage: stages.list[stages.activeStageId],
    }),
  );

  const { name: stageName, orderTree: stageOrderTree, tasks } = activeStage;

  return (
    <Wrapper>
      <span className="stage-number">Stage {stageOrderTree}</span>
      <span className="stage-name">{stageName}</span>

      <ul className="tasks-list">
        {(tasks as Array<Task['id']>).map((taskId, index) => (
          <TaskView task={tasksListMap[taskId]} key={index} />
        ))}
      </ul>
    </Wrapper>
  );
};

export default TaskListView;
