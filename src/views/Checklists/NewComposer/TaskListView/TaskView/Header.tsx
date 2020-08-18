import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  TimerOutlined,
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
      <div className="vacant" />

      <div className="content">
        {isEditing ? (
          <input
            name="name"
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
        ) : (
          <span>{task.name}</span>
        )}

        <div className={`task-control${!isEditing ? ' hide' : ''}`}>
          <div
            className={`task-control-item${task.hasStop ? ' active' : ''}`}
            // onClick={() => update({ hasStop: !task.hasStop })}
          >
            <ErrorOutlineOutlined className="icon" />
            <span>Add Stop</span>
          </div>
          <div className="task-control-item">
            <DateRangeOutlined className="icon" />
            <span>Due On</span>
          </div>
          <div
            className={`task-control-item${task.timed ? ' active' : ''}`}
            // onClick={() => update({ timed: !task.timed })}
          >
            <TimerOutlined className="icon" />
            <span>Timed</span>
          </div>
        </div>
      </div>

      <div className="header-icons">
        <AddCircleOutline className="icon" />
      </div>
    </HeaderWrapper>
  );
};

export default Header;
