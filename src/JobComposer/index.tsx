import { useTypedSelector } from '#store';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchData,
  resetComposer,
  startJobStatePolling,
  stopJobStatePolling,
} from './actions';
import { ComposerProps, Tabs } from './composer.types';
import Header from './Header';
import StageList from './StageList';
import ActivityView from './JobActivity';
import ComposerWrapper from './styles';
import TaskList from './TaskList';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const { isIdle } = useTypedSelector((state) => state.auth);
  const { activeStageId } = useTypedSelector((state) => state.composer.stages);
  const [activeTab, setActiveTab] = useState(Tabs.STAGES);

  useEffect(() => {
    if (!isIdle) {
      if (id) {
        dispatch(fetchData({ id, entity, setActive: true }));
        dispatch(startJobStatePolling({ jobId: id }));
      } else {
        console.log('no id got to fetch data');
      }

      return () => {
        dispatch(stopJobStatePolling());
        dispatch(resetComposer());
      };
    }
  }, [isIdle]);

  return (
    <ComposerWrapper activeTab={activeTab}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === Tabs.ACTIVITY ? (
        <ActivityView jobId={id} />
      ) : (
        <>
          <StageList />

          {activeStageId ? <TaskList /> : null}
        </>
      )}
    </ComposerWrapper>
  );
};

export default Composer;
