import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { ComposerState } from '../../composer.types';
import ActivityListView from './ActivityListView';
import Header from './Header';
import Footer from './Footer';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';
import { useDispatch } from 'react-redux';
import { setTaskActive } from '../actions';

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditingTemplate = composerState === ComposerState.EDIT;

  return (
    <Wrapper
      isEditing={isEditingTemplate}
      onClick={() => dispatch(setTaskActive(task.id))}
    >
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
