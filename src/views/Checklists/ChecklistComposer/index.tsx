import { useTypedSelector } from '#store';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../types';
import { fetchChecklist, setChecklistState } from './actions';
import Header from './Header';
import StagesList from './StageList';
// import StepsList from './TaskList';
import { Wrapper } from './styles';
import { ComposerProps } from './types';

const Composer: FC<ComposerProps> = ({
  checklistId,
  checklistState = ChecklistState.ADD_EDIT,
}) => {
  const dispatch = useDispatch();

  const { loading, checklist } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  useEffect(() => {
    !!checklistId && dispatch(fetchChecklist(parseInt(checklistId)));

    if (checklistState !== ChecklistState.ADD_EDIT) {
      dispatch(setChecklistState(checklistState));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (!isEmpty(checklist)) {
    return (
      <Wrapper>
        <Header />

        <StagesList />

        {/* <StepsList /> */}
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Composer;
