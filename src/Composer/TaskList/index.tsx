import React, { FC } from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '#store';

import TaskView from './TaskView';

const Wrapper = styled.div`
  display: grid;
  grid-area: tasks;
  grid-row-gap: 16px;
  grid-template-areas: 'stage-number' 'stage-name' 'tasks-list';
  grid-template-rows: 16px 32px 1fr;
  overflow: auto;

  .stage {
    &-name {
      align-items: center;
      color: #000000;
      cursor: default;
      display: flex;
      font-size: 24px;
      font-weight: bold;
      grid-area: stage-name;
    }

    &-number {
      align-items: center;
      color: #666666;
      cursor: default;
      display: flex;
      font-size: 12px;
      grid-area: stage-number;
    }
  }

  .tasks-list {
    grid-area: tasks-list;
  }
`;

const TaskListView: FC = () => {
  const {
    activeStage,
    tasks: { listIdOrder, activeTaskId, listById },
  } = useTypedSelector((state) => ({
    activeStage:
      state.composer.stages.listById[state.composer.stages.activeStageId],

    tasks: state.composer.tasks,
  }));

  return (
    <Wrapper>
      <div className="stage-number">Stage {activeStage.orderTree}</div>

      <div className="stage-name">{activeStage.name}</div>

      <div className="tasks-list">
        {listIdOrder.map((taskId) => (
          <TaskView
            isActive={taskId === activeTaskId}
            key={taskId}
            task={listById[taskId]}
          />
        ))}
      </div>
    </Wrapper>
  );
};

export default TaskListView;
