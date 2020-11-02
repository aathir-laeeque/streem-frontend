import { useTabs } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Composer } from './styles';
import TabContent from './TabContent';
import { JobState, ListViewProps, ListViewState } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const { selectedState }: ListViewState = useTypedSelector(
    (state) => state.jobListView,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!job?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.JOB }));
    }
  }, []);

  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: JobState.UNASSIGNED,
      active: selectedState === JobState.UNASSIGNED,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobState.ASSIGNED,
      active: selectedState === JobState.ASSIGNED,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobState.COMPLETED,
      active: selectedState === JobState.COMPLETED,
      TabContent,
      passThroughTabContentProps,
    },
  ]);

  return (
    <Composer>
      {renderTabsHeader()}
      {renderTabsContent()}
    </Composer>
  );
};

export default ListView;
