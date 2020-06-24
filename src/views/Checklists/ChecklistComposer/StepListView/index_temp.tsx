import React, { FC, useState } from 'react';
import { FieldArray } from 'formik';

import StepView from './StepView';
import { StepListViewProps } from './types';

import { StepsWrapper } from './styles';

const StepListView: FC<StepListViewProps> = ({
  steps,
  activeStage,
  stageName,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <StepsWrapper>
      <span className="stage-number">Stage {activeStage + 1}</span>
      <span className="stage-name">{stageName}</span>

      <FieldArray
        name="steps"
        render={() => (
          <ul className="step-list">
            {steps.map((step, index) => (
              <StepView
                stageNumber={activeStage}
                key={index}
                step={step}
                active={activeStep === index}
                onClick={() => setActiveStep(index)}
                isFirstStep={index === 0}
                isLastStep={steps.length - 1 === index}
                stepIndex={index}
              />
            ))}
          </ul>
        )}
      />
    </StepsWrapper>
  );
};

export default StepListView;
