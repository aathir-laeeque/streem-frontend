import React, { FC } from 'react';
import {
  AddCircleOutline,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DateRangeOutlined,
  ErrorOutlineOutlined,
  RadioButtonUnchecked,
  // Timer,
  TimerOutlined,
} from '@material-ui/icons';
import { Field } from 'formik';

import { StepViewProps } from './types';
import { Wrapper } from './styles';
import Header from './Header';
import TimedCard from './TimedCard';

const StepView: FC<StepViewProps> = ({
  active,
  isFirstStep,
  isLastStep,
  onClick,
  stageNumber,
  step,
  stepIndex,
}) => {
  return (
    <Wrapper>
      <div className="step-item-position-control">
        {!isFirstStep ? <ArrowUpwardOutlined className="icon" /> : null}
        <span className="step-number">{stepIndex + 1}</span>
        {!isLastStep ? <ArrowDownwardOutlined className="icon" /> : null}
      </div>

      <div
        className={`step-item-content ${
          active ? 'step-item-content-active' : ''
        }`}
        onClick={onClick}
      >
        <Header step={step} stageNumber={stageNumber} stepIndex={stepIndex} />

        <TimedCard step={step} />

        {/* <div>rest interactions</div> */}
      </div>

      <div className="step-item-media">step media</div>
    </Wrapper>
  );
};

export default StepView;
