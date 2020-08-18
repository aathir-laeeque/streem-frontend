import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';

import ActivityListView from './ActivityListView';
import Header from './Header';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';

const TaskView: FC<TaskViewProps> = ({ task, isActive }) => {
  return (
    <Wrapper>
      <div className="position-control">
        <ArrowUpwardOutlined className="icon icon-up" />

        <span className="step-number">{task.orderTree}</span>

        <ArrowDownwardOutlined className="icon icon-down" />
      </div>

      <div className={`task${isActive ? ' active' : ''}`}>
        <Header task={task} />

        <div className="task-content">
          <ActivityListView activities={task.activities} />
        </div>

        <div className="task-completion-buttons">Task Completion Buttons</div>
      </div>

      {isActive ? <div className="task-media">Task Media</div> : null}
    </Wrapper>
  );
};

export default TaskView;
