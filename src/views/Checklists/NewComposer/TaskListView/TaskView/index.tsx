import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { ComposerState } from '../../composer.types';
import ActivityListView from './ActivityListView';
import Header from './Header';
import Footer from './Footer';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditingTemplate = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditingTemplate}>
      <div className="task">
        <Header task={task} isEditingTemplate={isEditingTemplate} />

        <ActivityListView activities={task.activities} />

        <Footer isEditingTemplate={isEditingTemplate} />
      </div>

      <div className="task-media"></div>
    </Wrapper>
  );
};

export default TaskView;
