import { useTypedSelector } from '#store';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveStep } from '../actions';
import Header from './Header';
import { Wrapper } from './styles';
import { StepViewProps } from './types';
import InteractionView from './InteractionView';
import { InteractionType } from './InteractionView/types';
import StepMedia from './Media';

const StepView: FC<StepViewProps> = ({ step, stepIndex }) => {
  const { activeStepIndex } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const dispatch = useDispatch();

  const isStepActive = stepIndex === activeStepIndex;

  return (
    <Wrapper>
      <div className="step-item-position-control">
        <ArrowUpwardOutlined className="icon icon-up" />
        <span className="step-number">{stepIndex + 1}</span>
        <ArrowDownwardOutlined className="icon icon-down" />
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
