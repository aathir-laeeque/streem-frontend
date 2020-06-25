import { renderInputField } from '#components/FormComponents';
import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  RadioButtonUnchecked,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { change, Field } from 'redux-form';

import { Step } from '../types';

interface HeaderProps {
  step: Step;
  field: string;
}

const Header: FC<HeaderProps> = ({ step, field }) => {
  const dispatch = useDispatch();

  return (
    <div className="step-item-content-header">
      <div>
        <Field name={`${field}.name`} component={renderInputField} />

        <div className="step-item-controls">
          <div
            className={`step-item-controls-item ${
              step.hasStop ? 'item-active' : ''
            }`}
            onClick={() =>
              dispatch(
                change('stepsListForm', `${field}.hasStop`, !step.hasStop),
              )
            }
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
            onClick={() =>
              dispatch(change('stepsListForm', `${field}.timed`, !step.timed))
            }
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
