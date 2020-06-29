import { ChecklistState } from '#views/Checklists/types';
import { useTypedSelector } from '#store';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveStep } from './actions';
import Header from './Header';
import { Wrapper } from './styles';
import { Step } from './types';
import InteractionsList from './InteractionsList';
import { InteractionType } from './InteractionsList/types';
import StepMedia from './Media';

interface StepViewProps {
  step: Step;
  stepIndex: number;
}

const StepView: FC<StepViewProps> = ({ step, stepIndex }) => {
  const { state, activeStepIndex } = useTypedSelector(
    (state) => state.checklistComposer,
  );
  const dispatch = useDispatch();

  const isEditingTemplate = state === ChecklistState.ADD_EDIT;
  const isStepActive = stepIndex === activeStepIndex;

  const setAsActive = () =>
    !isStepActive ? dispatch(setActiveStep(stepIndex)) : undefined;

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined
          className={`icon icon-up${!isEditingTemplate ? ' hide' : ''}`}
        />
        <span className="step-number">{stepIndex + 1}</span>
        <ArrowDownwardOutlined
          className={`icon icon-down${!isEditingTemplate ? ' hide' : ''}`}
        />
      </div>

      <div
        className={`step-item-content${
          isStepActive ? ' step-item-content-active' : ''
        }`}
        onClick={setAsActive}
      >
        <Header step={step} />

        <InteractionsList
          // TODO remove this filter when MEDIA and MULTISELECT interactions are complete
          interactions={step.interactions.filter(
            (el) =>
              el.type !== InteractionType.MEDIA &&
              el.type !== InteractionType.MULTISELECT,
          )}
        />
      </div>

      <div className="step-item-media">
        {isStepActive && step.medias.length ? (
          <StepMedia medias={step.medias} />
        ) : null}
      </div>
    </Wrapper>
  );
};

export default StepView;
