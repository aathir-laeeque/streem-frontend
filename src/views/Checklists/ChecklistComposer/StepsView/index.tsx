import React, { FC, useState } from 'react';

import { StepsViewProps } from './types';
import Step from './Step';

const StepsView: FC<StepsViewProps> = ({ steps, activeStage, stage }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="steps-container">
      <span className="steps-active-stage-number">Stage {activeStage}</span>
      <span className="steps-active-stage-name">{stage?.name}</span>
      <div className="steps-list-container">
        {steps.map((step, index) => (
          <Step
            key={index}
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
