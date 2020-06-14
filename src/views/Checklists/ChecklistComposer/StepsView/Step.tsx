import {
  AddCircleOutline,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { StepViewProps } from './types';
import Interactions from './InteractionsView';

export const StepView: FC<StepViewProps> = ({ step, active, onClick }) => (
  <div style={{ display: 'flex' }}>
    <div
      className={`steps-list-item ${active ? 'steps-list-item-active' : ''}`}
      onClick={onClick}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: '40px' }}>
            <div className={`step-name ${active ? 'step-name-active' : ''}`}>
              {step?.name}
            </div>

            <div className="step-controls">
              <div className="step-controls-item">
                <ErrorOutlineOutlined />
                App Stop
              </div>
              <div className="step-controls-item">
                <DateRangeOutlined />
                Due On
              </div>
              <div className="step-controls-item">
                <TimerOutlined />
                Timed
              </div>
              <div className="step-controls-item">Optional</div>
            </div>
          </div>
          <AddCircleOutline className="icon add-circle" />
        </div>
        <Interactions interactions={step.interactions} />
      </div>
    </div>
    <div style={{ flex: 1, marginLeft: '16px' }}>Media space</div>
  </div>
);

export default StepView;
