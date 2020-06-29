import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import StepView from './StepView';
import { setActiveStep } from './StepView/actions';
import { Step } from './StepView/types';
import { Wrapper } from './styles';

const StepsList: FC = () => {
  const { activeStageIndex, activeStage, steps } = useTypedSelector(
    (state) => ({
      ...state.checklistComposer,
      activeStage:
        state.checklistComposer?.stages[
          state.checklistComposer?.activeStageIndex
        ],
    }),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveStep(0));
  }, [activeStageIndex]);

  return (
    <Wrapper>
      <span className="stage-number">Stage {activeStageIndex + 1}</span>
      <span className="stage-name">{activeStage.name}</span>

      <ul className="steps-list">
        {(steps as Array<Step>).map((step, index) => (
          <StepView key={index} step={step} stepIndex={index} />
        ))}
      </ul>
    </Wrapper>
  );
};

export default StepsList;
