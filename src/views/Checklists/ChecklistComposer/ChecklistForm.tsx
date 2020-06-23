import { withFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import Header from './Header';
import { Wrapper } from './newStyles';

import StageListView from './StageListView';
import { Stage } from './StageListView/types';

import StepListView from './StepListView';
import { Step } from './StepListView/StepView/types';

import { Checklist } from '../types';

interface ChecklistFormProps {
  handleSubmit: any;
  values: { stages: Stage[] };
}

const ChecklistForm = ({
  handleSubmit,
  values: { stages },
}: ChecklistFormProps) => {
  const [activeStage, setActiveStage] = useState(0);

  const [activeSteps, setActiveSteps] = useState<Step[]>(
    stages[activeStage].steps,
  );

  useEffect(() => {
    setActiveSteps(stages[activeStage].steps);
  }, [activeStage]);

  return (
    <form onSubmit={handleSubmit} style={{ height: 'inherit' }}>
      <Wrapper>
        <Header />

        <StageListView
          stages={stages}
          activeStage={activeStage}
          setActiveStage={(index) => setActiveStage(index)}
        />

        <StepListView
          steps={activeSteps}
          activeStage={activeStage}
          stageName={stages[activeStage].name}
        />
      </Wrapper>
    </form>
  );
};

export default withFormik({
  displayName: 'checklist form',

  mapPropsToValues: ({ checklist }: { checklist: Checklist }) => ({
    stages: checklist?.stages,
  }),

  handleSubmit: (finalValues) =>
    console.log('finalFormValues :: ', finalValues),
})(ChecklistForm);
