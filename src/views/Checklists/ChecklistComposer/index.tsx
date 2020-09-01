import { useTypedSelector } from '#store';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../types';
import {
  fetchChecklist,
  fetchSelectedJob,
  setChecklistState,
  resetComposer,
} from './actions';
import Header from './Header';
import StagesList from './StageList';
import { Wrapper } from './styles';
import TaskList from './TaskList';
import { ComposerProps } from './types';

const Composer: FC<ComposerProps> = ({
  checklistId,
  checklistState = ChecklistState.ADD_EDIT,
  jobId,
}) => {
  const dispatch = useDispatch();

  const { loading, checklist } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  useEffect(() => {
    if (checklistId) {
      dispatch(fetchChecklist(parseInt(checklistId)));
    } else if (jobId) {
      dispatch(fetchSelectedJob(parseInt(jobId)));
    }

    dispatch(setChecklistState(checklistState));

    return () => {
      // dispatch(resetComposer());
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (!isEmpty(checklist)) {
    return (
      <Wrapper>
        <Header />

        <StagesList />

        <TaskList />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Composer;
