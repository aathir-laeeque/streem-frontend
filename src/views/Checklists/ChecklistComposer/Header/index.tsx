import { Button } from '#components';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { Wrapper } from './styles';

const Header: FC = () => {
  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  return (
    <Wrapper>
      <div className="header-item">Stages</div>
      <span className="auto-save-text">All changes saved automatically</span>
      <Button>
        {isChecklistEditable ? 'Publish Checklist' : 'Complete Job'}
      </Button>
    </Wrapper>
  );
};

export default Header;
