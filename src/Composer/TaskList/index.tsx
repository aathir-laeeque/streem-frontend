import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import Wrapper from './styles';
import TaskView from './TaskView';

const TaskListView: FC = () => {
  const {
    stages: { activeStageId, stagesById, stagesOrder },
    tasks: {
      activeTaskId,
      tasksById,
      taskIdWithStop,
      tasksOrderInStage,
      stageIdWithTaskStop,
    },
  } = useTypedSelector((state) => state.composer);

  if (activeStageId) {
    const activeStage = stagesById[activeStageId];

    const tasksListIds = tasksOrderInStage[activeStageId];

    const shouldStageHaveStop =
      stagesOrder.indexOf(activeStageId) >=
      stagesOrder.indexOf(stageIdWithTaskStop);

    console.log('shouldStagehaveStop :: ', shouldStageHaveStop);

    return (
      <Wrapper>
        <div className="stage-number">Stage {activeStage.orderTree}</div>

        <div className="stage-name">{activeStage.name}</div>

        <div className="tasks-list">
          {tasksListIds.map((taskId, index) => {
            const enableStopForTask =
              shouldStageHaveStop &&
              index > tasksListIds.indexOf(taskIdWithStop);

            console.log(`enableStopForTask ${taskId} :: `, enableStopForTask);

            return (
              <TaskView
                isActive={taskId === activeTaskId}
                key={taskId}
                task={tasksById[taskId]}
                enableStopForTask={enableStopForTask}
              />
            );
          })}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default TaskListView;
