import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  RadioButtonUnchecked,
  TimerOutlined,
} from '@material-ui/icons';
import { Field } from 'formik';
import React, { FC } from 'react';

import { Step } from '../types';

interface HeaderProps {
  step: Step;
  stageNumber: number;
  stepIndex: number;
}

const Header: FC<HeaderProps> = ({ step, stageNumber, stepIndex }) => {
  return (
    <div className="step-item-content-header">
      <div>
        <Field name={`stages.${stageNumber}.steps.${stepIndex}.name`} />

        <div className="step-item-controls">
          <div
            className={`step-item-controls-item ${
              step.hasStop ? 'item-active' : ''
            }`}
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
      <AddCircleOutline className="icon" />
    </div>
  );
};

export default Header;
