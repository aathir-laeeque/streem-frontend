import { useTypedSelector } from '#store';
import { omit } from 'lodash';
import React, { FC } from 'react';

import Header from './Header';
import { Wrapper } from './newStyles';
import StageListView from './StageListView';
import { Stage } from './StageListView/types';
import StepListView from './StepListView';

const Checklist: FC = () => {
  const { stages } = useTypedSelector((state) => state.checklistComposer);

  return (
    <Wrapper>
      <Header />

      <StageListView
        initialValues={{
          stages: (stages as Array<Stage>)?.map((el) => ({
            ...omit(el, ['steps']),
          })),
        }}
      />

      <StepListView />
    </Wrapper>
  );
};

export default Checklist;
