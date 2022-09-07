import { useTypedSelector } from '#store';
import { CircularProgress } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData, resetComposer } from './actions';
import { ComposerProps } from './composer.types';
import Header from './Header';
import StageList from './StageList';
import { startPollActiveStageData, stopPollActiveStageData } from './StageList/actions';
import { ComposerWrapper, JobLoadingWrapper } from './styles';
import TaskList from './TaskList';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const {
    stages: { activeStageId },
    loading,
  } = useTypedSelector((state) => state.composer);

  useEffect(() => {
    if (id) {
      dispatch(fetchData({ id, entity, setActive: true }));
      dispatch(startPollActiveStageData({ jobId: id }));
    } else {
      console.log('no id got to fetch data');
    }

    return () => {
      dispatch(stopPollActiveStageData());
      dispatch(resetComposer());
    };
  }, []);

  return loading ? (
    <JobLoadingWrapper>
      <CircularProgress />
    </JobLoadingWrapper>
  ) : (
    <ComposerWrapper>
      <Header />
      <StageList />
      {activeStageId ? <TaskList /> : null}
    </ComposerWrapper>
  );
};

export default Composer;
