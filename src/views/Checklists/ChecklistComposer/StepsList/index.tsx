import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import StepView from './StepView';
import { Wrapper } from './styles';
import { setActiveStep } from './actions';

const StepsList: FC = () => {
  const { activeStageIndex, steps, activeStage } = useTypedSelector(
    (state) => ({
      steps: state.checklistComposer.steps,
      activeStageIndex: state.checklistComposer.activeStageIndex || 0,
      activeStage:
        state.checklistComposer?.stages[
          state.checklistComposer?.activeStageIndex
        ],
    }),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveStep(0));

    return () => dispatch(setActiveStep(0));
  }, []);

  useEffect(() => {
    dispatch(setActiveStep(0));
  }, [activeStageIndex]);

  return (
    <Wrapper>
      <span className="stage-number">Stage {activeStageIndex + 1}</span>
      <span className="stage-name">{activeStage.name}</span>

      <ul className="step-list">
        {steps?.map((step, index) => (
          <StepView key={index} step={step} stepIndex={index} />
        ))}
      </ul>
    </Wrapper>
  );
};

export default StepsList;
