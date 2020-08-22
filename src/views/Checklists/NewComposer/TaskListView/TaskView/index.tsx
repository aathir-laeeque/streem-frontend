import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import Select from 'react-select';

import { ComposerState } from '../../composer.types';
import ActivityListView from './ActivityListView';
import { customSelectStyles } from './ActivityListView/Activity/commonStyles';
import Header from './Header';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';
import { ArrowRightAlt } from '@material-ui/icons';

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

        <div className="task-buttons">
          {isEditing ? (
            <Select
              placeholder="Add activity"
              options={[]}
              styles={customSelectStyles}
            />
          ) : (
            <>
              <button className="complete-task">
                Complte Task <ArrowRightAlt className="icon" />
              </button>
              <button className="skip-task">Skip the task</button>
            </>
          )}
        </div>
      </div>

      <div className="task-media"></div>
    </Wrapper>
  );
};

export default TaskView;
