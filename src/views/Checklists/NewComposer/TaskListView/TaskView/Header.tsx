import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  Delete,
  ErrorOutlineOutlined,
  PermMedia,
  TimerOutlined,
  PanTool,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { ComposerState } from '../../composer.types';
import { HeaderWrapper } from './styles';
import { HeaderProps } from './types';

const Header: FC<HeaderProps> = ({ task }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <HeaderWrapper isEditing={isEditing}>
      <div className="top-bar">
        {isEditing ? (
          <>
            <div className="position-control-buttons">
              <ArrowUpwardOutlined className="icon icon-up" />

              <ArrowDownwardOutlined className="icon icon-down" />
            </div>

            <span className="step-number">Task {task.orderTree}</span>

            <Delete className="icon" />
          </>
        ) : task.hasStop ? (
          <div className="stop-banner">
            <PanTool className="icon" />

            <span>Complete this task before proceeding to the next task.</span>
          </div>
        ) : null}
      </div>

      <div className="content">
        {isEditing ? (
          <>
            <div className="new-form-field">
              <label className="new-form-field-label">Name the Task</label>
              <input
                className="new-form-field-input"
                name="name"
                type="text"
                value={task.name}
                onChange={(e) => {
                  e.persist();
                  customOnChange(e, (event) =>
                    console.log(
                      'event.target.value onChange :: ',
                      event.target.value,
                    ),
                  );
                }}
              />
            </div>

            <div className="task-control">
              <div
                className={`task-control-item${task.timed ? ' active' : ''}`}
              >
                <TimerOutlined className="icon" />
                <span>Timed</span>
              </div>

              <div className="task-control-item">
                <PermMedia className="icon" />
                <span>Attatch Media</span>
              </div>

              <div
                className={`task-control-item${task.hasStop ? ' active' : ''}`}
              >
                <ErrorOutlineOutlined className="icon" />
                <span>Add Stop</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="task-orderTree">{task.orderTree}.</span>
            <span className="task-name">{task.name}</span>
          </>
        )}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
