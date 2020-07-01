import { useTypedSelector } from '#store';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  ArrowForward,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../types';
import { setActiveStep } from '../actions';
import Header from './Header';
import InteractionView from './InteractionView';
import { InteractionType } from './InteractionView/types';
import StepMedia from './Media';
import { Wrapper } from './styles';
import { StepViewProps } from './types';
import { completeStep } from './actions';

const StepView: FC<StepViewProps> = ({ step, stepIndex }) => {
  const { activeStepIndex, checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch = useDispatch();

  const isStepActive = stepIndex === activeStepIndex;
  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined
          className={`icon icon-up${!isCreatingChecklist ? ' hide' : ''}`}
        />
        <span className="step-number">{stepIndex + 1}</span>
        <ArrowDownwardOutlined
          className={`icon icon-down${!isCreatingChecklist ? ' hide' : ''}`}
        />
      </div>

      <div
        className={`step-item-content${
          isStepActive ? ' step-item-content-active' : ''
        }`}
        onClick={() =>
          !isStepActive ? dispatch(setActiveStep(stepIndex)) : undefined
        }
      >
        <Header step={step} />

        {/* TODO: build the timed card here */}
        {/* <TimedCard step={step} /> */}

        {/* render the interactions here */}
        <div className="step-interactions-list">
          {step.interactions
            .filter(
              (el) =>
                el.type !== InteractionType.MULTISELECT &&
                el.type !== InteractionType.MEDIA,
            )
            .map((interaction, index) => (
              <InteractionView
                key={index}
                interaction={interaction}
                interactionIndex={index}
              />
            ))}
        </div>

        {!isCreatingChecklist ? (
          <div
            className="complete-step"
            onClick={() => dispatch(completeStep({ id: step.id }))}
          >
            Complete Step <ArrowForward className="icon" />
          </div>
        ) : null}

        {/* {!isCreatingChecklist ? (
          <div className="skip-step">Skip this step</div>
        ) : null} */}
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
