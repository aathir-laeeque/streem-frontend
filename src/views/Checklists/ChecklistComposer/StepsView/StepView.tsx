import {
  AddCircleOutline,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import Interactions from './InteractionsView';
import { InteractionType } from './InteractionsView/types';
import MediaInteraction from './Media';
import { StepViewProps } from './types';

const StepView: FC<StepViewProps> = ({
  step,
  active,
  onClick,
  isFirstStep,
  isLastStep,
  stepNumber,
}) => {
  const mediaInteractions = step.interactions.filter(
    (el) => el.type === InteractionType.MEDIA,
  );

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '16px',
          alignItems: 'center',
        }}
      >
        {!isFirstStep ? <ArrowUpwardOutlined className="icon" /> : null}
        <span style={{ margin: '5px 0', color: '#999999' }}>{stepNumber}</span>
        {!isLastStep ? <ArrowDownwardOutlined className="icon" /> : null}
      </div>
      <div
        className={`steps-list-item ${active ? 'steps-list-item-active' : ''}`}
        onClick={onClick}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ marginLeft: '40px', flex: 1 }}>
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
          <Interactions
            interactions={step.interactions.filter(
              (el) =>
                el.type !== InteractionType.MEDIA &&
                el.type !== InteractionType.MULTISELECT,
            )}
          />
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: '16px' }}>
        {mediaInteractions.map((interaction, index) => (
          <MediaInteraction interaction={interaction} key={index} />
        ))}
      </div>
    </div>
  );
};

export default StepView;
