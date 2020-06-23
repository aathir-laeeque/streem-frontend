import { SingleSelect } from '#components/FormComponents';

import React, { FC } from 'react';

import { RULES } from '../constants';
import { Step } from '../types';
import { Wrapper } from './styles';

interface TimedCardProps {
  step: Step;
}

const TimedCard: FC<TimedCardProps> = ({ step }) =>
  step.timed ? (
    <Wrapper>
      <div className="timed-rule">
        <SingleSelect
          label="Time Rule"
          name="step.timer.operation"
          options={RULES}
        />
      </div>
    </Wrapper>
  ) : null;

export default TimedCard;
