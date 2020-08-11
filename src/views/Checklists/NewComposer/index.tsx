import { useTypedSelector } from '#store';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchChecklist,
  fetchSelectedJob,
  resetComposer,
  setComposerState,
} from './composer.action';
import Header from './composer.header';
import { ComposerProps, ComposerState } from './composer.types';
import StageListView from './StageListView';
import { Wrapper } from './styles';

let renderCount = 0;

const Composer: FC<ComposerProps> = ({
  checklistId,
  jobId,
  composerState = ComposerState.EDIT,
}) => {
  console.log('composerState from the component :: ', composerState);
  console.log('render count :: ', ++renderCount);

  const dispatch = useDispatch();

  const { loading, checklist } = useTypedSelector((state) => state.newComposer);

  useEffect(() => {
    if (checklistId) {
      console.log('fetch the checklist with id : ', checklistId);
      dispatch(fetchChecklist(parseInt(checklistId)));
    } else if (jobId) {
      console.log('fetch job with jobId : ', jobId);
      dispatch(fetchSelectedJob(parseInt(jobId)));
    }

    dispatch(setComposerState(composerState));

    return () => {
      dispatch(resetComposer());
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isEmpty(checklist)) {
    return (
      <Wrapper>
        <Header />

        <StageListView />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Composer;
