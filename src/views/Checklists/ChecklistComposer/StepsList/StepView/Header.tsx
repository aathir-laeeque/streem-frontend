import { useTypedSelector } from '#store';
import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  RadioButtonUnchecked,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { TemplateMode, ChecklistState } from '../../types';
import { updateStep } from './actions';
import { Step } from './types';

const Header: FC<{ step: Step }> = ({ step }) => {
  const { templateMode, checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch = useDispatch();

  const allowEditing = templateMode === TemplateMode.EDITABLE;
  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  return (
    <div
      className={`step-item-content-header${
        !isCreatingChecklist ? ' no-margin' : ''
      }`}
    >
      <div>
        <input
          type="text"
          name="header"
          value={step.name}
          onChange={(e) => dispatch(updateStep({ name: e.target.value }))}
          {...(!allowEditing && { disabled: true })}
        />

        <div
          className={`step-item-controls${!isCreatingChecklist ? ' hide' : ''}`}
        >
          <div
            className={`step-item-controls-item ${
              step.hasStop ? 'item-active' : ''
            }`}
            onClick={() => dispatch(updateStep({ hasStop: !step.hasStop }))}
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
              step.timed ? 'item-active' : ''
            }`}
            onClick={() => dispatch(updateStep({ timed: !step.timed }))}
          >
            <TimerOutlined className="icon" />
            <span>Timed</span>
          </div>
          <div className="step-item-controls-item">
            <RadioButtonUnchecked className="icon" />
            <span>Optional</span>
          </div>
        </div>
      </div>
      <AddCircleOutline
        className={`icon${!isCreatingChecklist ? ' hide' : ''}`}
      />
    </div>
  );
};

export default Header;
