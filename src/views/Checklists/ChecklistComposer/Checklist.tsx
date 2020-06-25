import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from './Header';
import StageList from './StageList';
import StepsList from './StepsList';
import { Wrapper } from './styles';
import { ChecklistProps } from './types';
import { setChecklistModes } from './actions';

const Checklist: FC<ChecklistProps> = ({ checklistState, templateMode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChecklistModes({ checklistState, templateMode }));
  }, []);

  return (
    <Wrapper>
      <Header />

      <StageList />

      <StepsList />
    </Wrapper>
  );
};

export default Checklist;
