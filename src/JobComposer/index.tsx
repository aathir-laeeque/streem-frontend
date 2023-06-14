import { useTypedSelector } from '#store';
import { CircularProgress } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from './Header';
import { startPollActiveStageData, stopPollActiveStageData } from './StageList/actions';
import TaskList from './TaskList';
import { fetchData, resetComposer } from './actions';
import { ComposerProps } from './composer.types';
import { ComposerWrapper, JobLoadingWrapper } from './styles';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const infoExpanded = useState(false);
  const overviewOpen = useState(false);
  const {
    stages: { activeStageId },
    loading,
    data,
    parameters: { showVerificationBanner },
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
    <ComposerWrapper showVerificationBanner={showVerificationBanner}>
      <Header infoExpanded={infoExpanded} overviewOpen={overviewOpen} />
      {activeStageId ? <TaskList overviewOpen={overviewOpen} /> : null}
    </ComposerWrapper>
  );
};

export default Composer;
