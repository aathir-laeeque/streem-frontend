import { useTypedSelector } from '#store';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchData, resetComposer } from './actions';
import { ComposerProps, Tabs } from './composer.types';
import Header from './Header';
import StageList from './StageList';
import ActivityView from './JobActivity';
import ComposerWrapper from './styles';
import TaskList from './TaskList';
import {
  startPollActiveStageData,
  stopPollActiveStageData,
} from './StageList/actions';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const { activeStageId } = useTypedSelector((state) => state.composer.stages);
  const [activeTab, setActiveTab] = useState(Tabs.STAGES);

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
