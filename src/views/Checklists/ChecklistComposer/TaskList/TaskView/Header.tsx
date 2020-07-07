import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateTask } from './actions';
import { HeaderWrapper } from './styles';
import { HeaderProps, updateParams } from './types';
import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';

const Header: FC<HeaderProps> = ({ task }) => {
  const { state } = useTypedSelector((state) => state.checklist.composer);

  const isChecklistEditable = state === ChecklistState.ADD_EDIT;

  const dispatch = useDispatch();

  const update = (updatedTask: updateParams) =>
    dispatch(updateTask({ ...updatedTask, id: task.id }));

  return (
    <HeaderWrapper isChecklistEditable={isChecklistEditable}>
      <div>
        <input
          type="text"
          name="header"
          value={task.name}
          onChange={(e) => update({ name: e.target.value })}
          {...(!isChecklistEditable && { disabled: true })}
        />

        <div
          className={`step-item-controls${!isChecklistEditable ? ' hide' : ''}`}
        >
          <div
            className={`step-item-controls-item ${
              task.hasStop ? 'item-active' : ''
            }`}
            onClick={() => update({ hasStop: !task.hasStop })}
          >
            <ErrorOutlineOutlined className="icon" />
            <span>Add Stop</span>
          </div>
          <div className="step-item-controls-item">
            <DateRangeOutlined className="icon" />
            <span>Due On</span>
          </div>
          <div
            className={`step-item-controls-item ${
              task.timed ? 'item-active' : ''
            }`}
            onClick={() => update({ timed: !task.timed })}
          >
            <TimerOutlined className="icon" />
            <span>Timed</span>
          </div>
        </div>
      </div>
      <AddCircleOutline
        className={`icon${!isChecklistEditable ? ' hide' : ''}`}
      />
    </HeaderWrapper>
  );
};

export default Header;
