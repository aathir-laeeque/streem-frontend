import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  Delete,
  ErrorOutlineOutlined,
  PanTool,
  PermMedia,
  TimerOutlined,
  Timer,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { updateTask } from '../actions';
import { HeaderWrapper } from './styles';
import { HeaderProps } from './types';

const Header: FC<HeaderProps> = ({ task, isEditingTemplate }) => {
  const dispatch = useDispatch();

  return (
    <HeaderWrapper isEditing={isEditingTemplate} hasStop={task.hasStop}>
      {/* task-controller div contains the delete and task position reorder buttons */}

      <div className="task-controller">
        <div className="position-control-buttons">
          <ArrowUpwardOutlined className="icon icon-up" />

          <ArrowDownwardOutlined className="icon icon-down" />
        </div>

        <span className="step-number">Task {task.orderTree}</span>

        <Delete className="icon delete-task" />
      </div>

      <div className="stop-banner">
        <PanTool className="icon" />

        <span>Complete this task before proceeding to the next task.</span>
      </div>

      <div className="task-config">
        <div className="task-name">
          <span className="task-orderTree">{task.orderTree}.</span>

          <span className="task-name">{task.name}</span>

          <div className="new-form-field">
            <label className="new-form-field-label">Name the Task</label>
            <input
              className="new-form-field-input"
              name="name"
              type="text"
              value={task.name}
              onChange={(e) => {
                dispatch(updateTask({ name: e.target.value }));
              }}
            />
          </div>
        </div>

        {task.timed ? (
          <div className="task-timer">
            <Timer className="icon" />
            <span>
              Complete Under {moment.duration(task.period).minutes()} min :{' '}
              {moment.duration(task.period).seconds()} sec
            </span>
          </div>
        ) : null}

        <div className="task-control">
          <div className={`task-control-item${task.timed ? ' active' : ''}`}>
            <TimerOutlined className="icon" />
            <span>Timed</span>
          </div>

          <div className="task-control-item">
            <PermMedia className="icon" />
            <span>Attatch Media</span>
          </div>

          <div className={`task-control-item${task.hasStop ? ' active' : ''}`}>
            <ErrorOutlineOutlined className="icon" />
            <span>Add Stop</span>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
