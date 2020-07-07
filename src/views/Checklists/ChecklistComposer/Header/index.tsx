import { Button } from '#components';
import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { setChecklistState } from '../actions';
import { Wrapper } from './styles';

const Header: FC = () => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  return (
    <Wrapper>
      <div className="header-item">Stages</div>
      <span className="auto-save-text">All changes saved automatically</span>
      <Button
        onClick={() => {
          if (isChecklistEditable) {
            dispatch(setChecklistState(ChecklistState.EXECUTING));
          } else {
            dispatch(setChecklistState(ChecklistState.ADD_EDIT));
          }
        }}
      >
        Publish Checklist
      </Button>
    </Wrapper>
  );
};

export default Header;
