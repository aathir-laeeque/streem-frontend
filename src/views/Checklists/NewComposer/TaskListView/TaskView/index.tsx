import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';

import ActivityListView from './ActivityListView';
import Header from './Header';
import { Wrapper } from './styles';
import { TaskViewProps } from './types';

const TaskView: FC<TaskViewProps> = ({ task }) => {
  return (
    <Wrapper>
      <div className="position-control">
        <ArrowUpwardOutlined className="icon icon-up" />

        <span className="step-number">{task.orderTree}</span>

        <ArrowDownwardOutlined className="icon icon-down" />
      </div>

      <div className={`task`}>
        <Header task={task} />

        <div className="task-content">
          <ActivityListView activities={task.activities} />
        </div>

        <div className="task-completion-buttons">Task Completion Buttons</div>
      </div>

      <div className="task-media"></div>
    </Wrapper>
  );
};

export default TaskView;
