import { useTypedSelector } from '#store';
import React, { FC, RefObject, createRef, useEffect } from 'react';

import Wrapper from './styles';
import TaskView from './TaskView';
import { Task } from '../checklist.types';

const TaskListView: FC = () => {
  const {
    stages: { activeStageId, stagesById, stagesOrder },
    tasks: {
      activeTaskId,
      bringIntoView,
      tasksById,
      taskIdWithStop,
      tasksOrderInStage,
      stageIdWithTaskStop,
    },
  } = useTypedSelector((state) => state.composer);

  const activeStage = stagesById[activeStageId];

  const tasksListIds = tasksOrderInStage[activeStageId];

  const shouldStageHaveStop =
    stagesOrder.indexOf(stageIdWithTaskStop) > -1 &&
    stagesOrder.indexOf(activeStageId) >=
      stagesOrder.indexOf(stageIdWithTaskStop);

  const refMap = tasksListIds.reduce<
    Record<Task['id'], RefObject<HTMLDivElement>>
  >((acc, taskId) => {
    acc[taskId] = createRef<HTMLDivElement>();

    return acc;
  }, {});

  useEffect(() => {
    if (activeTaskId && bringIntoView) {
      if (refMap[activeTaskId].current) {
        refMap[activeTaskId].current.scrollIntoView({
          behaviour: 'smooth',
          block: 'start',
        });
      }
    }
  }, [activeTaskId]);

  return (
    <Wrapper>
      <div className="stage-number">Stage {activeStage.orderTree}</div>

      <div className="stage-name">{activeStage.name}</div>

      <div className="tasks-list">
        {tasksListIds.map((taskId, index) => {
          console.log('shouldStageHaveStop :: ', shouldStageHaveStop);
          const enableStopForTask =
            shouldStageHaveStop && index > tasksListIds.indexOf(taskIdWithStop);

          return (
            <TaskView
              isActive={taskId === activeTaskId}
              key={taskId}
              task={tasksById[taskId]}
              enableStopForTask={enableStopForTask}
              ref={refMap[taskId]}
            />
          );
        })}
      </div>
    </Wrapper>
  );
};

export default TaskListView;
