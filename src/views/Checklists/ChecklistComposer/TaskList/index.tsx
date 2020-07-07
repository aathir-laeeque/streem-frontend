import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { Wrapper } from './styles';
import TaskView from './TaskView';

const TaskList: FC = () => {
  const {
    list: tasks = {},
    activeStageName,
    stageOrderPosition,
  } = useTypedSelector((state) => state.checklist.composer.tasks);

  return (
    <Wrapper>
      <span className="stage-number">Stage {stageOrderPosition}</span>
      <span className="stage-name">{activeStageName}</span>

      <ul className="steps-list">
        {Object.values(tasks)?.map((task, index) => (
          <TaskView key={index} task={task} />
        ))}
      </ul>
    </Wrapper>
  );
};

export default TaskList;
