import { Button } from '#components';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { navigate } from '@reach/router';
import { Wrapper } from './styles';

const Header: FC = () => {
  const { isChecklistEditable, jobId } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  return (
    <Wrapper>
      <div className="header-item">Stages</div>
      <span className="auto-save-text">All changes saved automatically</span>
      <Button>
        {isChecklistEditable ? 'Publish Checklist' : 'Complete Job'}
      </Button>
      {jobId && (
        <Button onClick={() => navigate(`print/${jobId}`)}>
          Print Checklist
        </Button>
      )}
    </Wrapper>
  );
};

export default Header;
