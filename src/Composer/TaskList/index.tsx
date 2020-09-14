import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import Wrapper from './styles';
import TaskView from './TaskView';

const TaskListView: FC = () => {
  const {
    stages: { activeStageId, stagesById },
    tasks: { activeTaskId, tasksById, tasksOrderInStage },
  } = useTypedSelector((state) => state.composer);

  if (activeStageId) {
    const activeStage = stagesById[activeStageId];

    const tasksListIds = tasksOrderInStage[activeStageId];

    return (
      <Wrapper>
        <div className="stage-number">Stage {activeStage.orderTree}</div>

        <div className="stage-name">{activeStage.name}</div>

        <div className="tasks-list">
          {tasksListIds.map((taskId) => (
            <TaskView
              isActive={taskId === activeTaskId}
              key={taskId}
              task={tasksById[taskId]}
            />
          ))}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default TaskListView;
