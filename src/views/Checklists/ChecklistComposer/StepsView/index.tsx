import React, { FC, useState } from 'react';

import StepView from './StepView';
import { StepsViewProps } from './types';

const StepsView: FC<StepsViewProps> = ({ steps, activeStage, stage }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="steps-container">
      <span className="steps-active-stage-number">Stage {activeStage}</span>
      <span className="steps-active-stage-name">{stage?.name}</span>
      <div className="steps-list-container">
        {steps.map((step, index) => (
          <StepView
            stepNumber={index + 1}
            key={index}
            isFirstStep={index === 0}
            isLastStep={index === steps.length - 1}
            step={step}
            active={index === activeStep}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsView;
