import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ComposerState } from '../../composer.types';
import { setTaskActive } from '../actions';
import ActivityListView from './ActivityListView';
import Footer from './Footer';
import Header from './Header';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditingTemplate = composerState === ComposerState.EDIT;

  const isTaskSkipable = !task.activities.reduce((acc, activity) => {
    acc = acc || activity.mandatory;
    return acc;
  }, false);

  return (
    <Wrapper
      isEditing={isEditingTemplate}
      onClick={() => dispatch(setTaskActive(task.id))}
    >
      <div className="task">
        <Header task={task} isEditingTemplate={isEditingTemplate} />

        <ActivityListView activities={task.activities} />

        <Footer
          isEditingTemplate={isEditingTemplate}
          isTaskSkipable={isTaskSkipable}
        />
      </div>

      <div className="task-media"></div>
    </Wrapper>
  );
};

export default TaskView;
