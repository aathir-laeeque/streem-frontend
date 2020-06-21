import {
  AddCircleOutline,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  RadioButtonUnchecked,
  Timer,
  TimerOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import Interactions from './InteractionsView';
import { TARGET_RULES } from './InteractionsView/constants';
import { InteractionType } from './InteractionsView/types';
import StepMedia from './StepMedia';
import { StepViewProps } from './types';

const StepView: FC<StepViewProps> = ({
  step,
  active,
  onClick,
  isFirstStep,
  isLastStep,
  stepNumber,
}) => {
  const stepMedias = step.medias;

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
                <div
                  className={`step-controls-item ${
                    step.hasStop ? 'item-active' : ''
                  }`}
                >
                  <ErrorOutlineOutlined className="icon" />
                  <span>Add Stop</span>
                </div>
                <div className="step-controls-item">
                  <DateRangeOutlined className="icon" />
                  <span>Due On</span>
                </div>
                <div
                  className={`step-controls-item ${
                    step.timed ? 'item-active' : ''
                  }`}
                >
                  <TimerOutlined className="icon" />
                  <span>Timed</span>
                </div>
                <div className="step-controls-item">
                  <RadioButtonUnchecked className="icon" />
                  <span>Optional</span>
                </div>
              </div>
            </div>
            <AddCircleOutline className="icon add-circle" />
          </div>

          {step.timed ? (
            <div className="timed-card">
              <div className="timed-rule">
                <div className="form-field">
                  <label className="form-input-label">Time Rule</label>
                  <select
                    id="target-rule-select"
                    className="form-input"
                    value={step?.timer?.operator}
                  >
                    <option value="" selected disabled hidden>
                      Choose here
                    </option>
                    {TARGET_RULES.map((rule, index) => (
                      <option key={index} value={rule.value}>
                        {rule.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-input-label">{''}</label>
                  <input
                    className="form-input form-input-value"
                    value={`${step?.timer?.value} \t\t\t\t ${step?.timer?.unit}`}
                    onChange={undefined}
                    type="text"
                    name="timed-value"
                    placeholder="Value"
                  />
                </div>
              </div>
              <div className="clock">
                <Timer className="icon" />
                <span>A timer will be displayed at the time of execution</span>
              </div>
            </div>
          ) : null}

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
        {stepMedias.length && active ? <StepMedia medias={stepMedias} /> : null}
      </div>
    </div>
  );
};

export default StepView;
