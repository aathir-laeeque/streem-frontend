import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { Wrapper } from './styles';
import TaskView from './TaskView';

const TaskList: FC = () => {
  const { activeStage, tasks = {} } = useTypedSelector((state) => ({
    activeStage:
      state.checklist.composer.stages.list[
        state.checklist.composer.stages.activeStageId
      ],

    tasks: state.checklist.composer.tasks.list,
  }));

  return (
    <Wrapper>
      <span className="stage-number">Stage {activeStage.orderTree}</span>
      <span className="stage-name">{activeStage.name}</span>

      <ul className="steps-list">
        {Object.values(tasks)?.map((task, index) => (
          <TaskView key={index} task={task} />
        ))}
      </ul>
    </Wrapper>
  );
};

export default TaskList;
