import React, { FC } from 'react';
import { Step as StepInterface } from '../types';
import Step from './StepView';

interface StepsListView {
  steps: StepInterface[] | [];
}

const StepsListView: FC<StepsListView> = ({ steps }) => (
  <div style={{ marginTop: '16px', overflow: 'scroll', padding: '1px' }}>
    {(steps as Array<StepInterface>).map((step, index) => (
      <Step step={step} key={index} />
    ))}
  </div>
);

export default StepsListView;
