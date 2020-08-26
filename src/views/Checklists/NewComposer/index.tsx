import { useTypedSelector } from '#store';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  fetchComposerData,
  fetchSelectedJob,
  resetComposer,
  setComposerState,
} from './composer.action';
import Header from './composer.header';
import { ComposerProps, ComposerState } from './composer.types';
import StageListView from './StageListView';
import TaskListView from './TaskListView';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    'header header'
    'stage-list-view tasks-list-view';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;
`;

const Composer: FC<ComposerProps> = ({
  checklistId,
  jobId,
  composerState = ComposerState.EDIT,
}) => {
  const dispatch = useDispatch();

  const { loading, checklist } = useTypedSelector((state) => state.newComposer);

  useEffect(() => {
    if (checklistId) {
      dispatch(fetchComposerData(parseInt(checklistId), 'checklist'));
    } else if (jobId) {
      dispatch(fetchComposerData(parseInt(jobId), 'job'));
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

        <TaskListView />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default Composer;
