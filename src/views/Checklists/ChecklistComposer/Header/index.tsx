import { Button } from '#components';

import React, { FC } from 'react';

import { Wrapper } from './styles';
import { useTypedSelector } from '#store';
import { ChecklistState } from '../types';

const Header: FC = () => {
  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  return (
    <Wrapper>
      <div className="header-item">Stages</div>
      <span className="auto-save-text">All changes saved automatically</span>
      <Button>
        {isCreatingChecklist ? 'Publish Checklist' : 'Complete Job'}
      </Button>
    </Wrapper>
  );
};

export default Header;
