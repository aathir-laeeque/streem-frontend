import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveTask } from './actions';
import ActivityList from './ActivityList';
import { ActivityType } from './ActivityList/Activity/types';
import Header from './Header';
import StepMedia from './Media';
import { Wrapper } from './styles';
import { Task } from './types';

interface TaskViewProps {
  task: Task;
}

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const {
    tasks: { activeTaskId },
    state,
  } = useTypedSelector((state) => state.checklist.composer);

  const dispatch = useDispatch();

  const isChecklistEditable = state === ChecklistState.ADD_EDIT;

  const isTaskActive = task.id === activeTaskId;

  const setAsActive = () =>
    !isTaskActive ? dispatch(setActiveTask(task.id)) : undefined;

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined
          className={`icon icon-up${!isChecklistEditable ? ' hide' : ''}`}
        />
        <span className="step-number">{task.orderTree}</span>
        <ArrowDownwardOutlined
          className={`icon icon-down${!isChecklistEditable ? ' hide' : ''}`}
        />
      </div>

      <div
        className={`step-item-content${
          isTaskActive ? ' step-item-content-active' : ''
        }`}
        onClick={setAsActive}
      >
        <Header task={task} />

        <ActivityList
          activitiesId={task.activities
            // TODO remove this filter when MEDIA and MULTISELECT activity are complete
            .filter(
              (el) =>
                el.type !== ActivityType.MEDIA &&
                el.type !== ActivityType.MULTISELECT,
            )
            .map((el) => el.id)}
        />
      </div>

      <div className="step-item-media">
        {isTaskActive && task?.medias?.length ? (
          <StepMedia medias={task.medias} />
        ) : null}
      </div>
    </Wrapper>
  );
};

export default TaskView;
