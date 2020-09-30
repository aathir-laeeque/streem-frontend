import React, { FC } from 'react';

import { TaskMediasWrapper } from './styles';
import { TaskMediasProps } from './types';
import { useTypedSelector } from '../../store/helpers';

const TaskMedias: FC<TaskMediasProps> = ({ medias, taskId }) => {
  const { activeTaskId } = useTypedSelector(
    (state) => state.prototypeComposer.tasks,
  );

  if (taskId === activeTaskId && medias.length) {
    return <TaskMediasWrapper>Task medias</TaskMediasWrapper>;
  } else {
    return <TaskMediasWrapper />;
  }
};

export default TaskMedias;
