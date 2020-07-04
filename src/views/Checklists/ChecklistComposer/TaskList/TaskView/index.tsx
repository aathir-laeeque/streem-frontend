import { useTypedSelector } from '#store';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveTask } from './actions';
import Header from './Header';
import InteractionsList from './InteractionsList';
import { InteractionType } from './InteractionsList/types';
import StepMedia from './Media';
import { Wrapper } from './styles';
import { Task } from './types';

interface TaskViewProps {
  task: Task;
}

const TaskView: FC<TaskViewProps> = ({ task }) => {
  const { activeTaskId } = useTypedSelector(
    (state) => state.checklist.composer.tasks,
  );

  const dispatch = useDispatch();

  const isTaskActive = task.id === activeTaskId;

  const setAsActive = () =>
    !isTaskActive ? dispatch(setActiveTask(task.id)) : undefined;

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined className={`icon icon-up`} />
        <span className="step-number">{task.orderTree}</span>
        <ArrowDownwardOutlined className={`icon icon-down`} />
      </div>

      <div
        className={`step-item-content${
          isTaskActive ? ' step-item-content-active' : ''
        }`}
        onClick={setAsActive}
      >
        <Header task={task} />

        <InteractionsList
          // TODO remove this filter when MEDIA and MULTISELECT interactions are complete
          interactions={task.activities.filter(
            (el) =>
              el.type !== InteractionType.MEDIA &&
              el.type !== InteractionType.MULTISELECT,
          )}
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
