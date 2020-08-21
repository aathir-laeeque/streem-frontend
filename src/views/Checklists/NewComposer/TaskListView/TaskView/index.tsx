import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { ComposerState } from '../../composer.types';
import ActivityListView from './ActivityListView';
import Header from './Header';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="task">
        <Header task={task} />

        <div className="task-content">
          <ActivityListView activities={task.activities} />
        </div>

        <div className="task-completion-buttons">
          {isEditing ? '' : 'Task Completion Buttons'}
        </div>
      </div>

      <div className="task-media"></div>
    </Wrapper>
  );
};

export default TaskView;
