import React, { FC } from 'react';

import Header from './Header';
import StageList from './StageList';
import StepsList from './StepsList';
import { Wrapper } from './styles';

const NewChecklist: FC = () => (
  <Wrapper>
    <Header />

    <StageList />

    <StepsList />
  </Wrapper>
);

export default NewChecklist;
