import { useTypedSelector } from '#store/helpers';
import React, { createRef, FC } from 'react';

import { TaskListWrapper } from './styles';
import TaskCard from './TaskCard';
import TaskMedias from './TaskMedias';

const Tasks: FC = () => {
  const {
    stages: { activeStageId },
    tasks: { tasksOrderInStage, listById },
  } = useTypedSelector((state) => state.prototypeComposer);

  if (activeStageId) {
    const taskListOrder = tasksOrderInStage[activeStageId];

    const refMap = taskListOrder.map(() => createRef<HTMLDivElement>());

    return (
      <TaskListWrapper>
        {taskListOrder?.map((taskId, index) => {
          const task = listById[taskId];

          return (
            <div className="task-list-item" key={`${task.id}-${index}`} ref={refMap[index]}>
              <TaskCard
                task={task}
                index={index}
                isFirstTask={index === 0}
                isLastTask={index === taskListOrder.length - 1}
              />
              <TaskMedias medias={task.medias} taskId={task.id} />
            </div>
          );
        })}
      </TaskListWrapper>
    );
  }

  return null;
};

export default Tasks;
