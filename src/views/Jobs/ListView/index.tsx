import { useTabs } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Composer } from './styles';
import TabContent from './TabContent';
import { JobStatus, ListViewProps, ListViewState } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const { selectedStatus }: ListViewState = useTypedSelector(
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
      label: JobStatus.UNASSIGNED,
      active: selectedStatus === JobStatus.UNASSIGNED,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobStatus.ASSIGNED,
      active: selectedStatus === JobStatus.ASSIGNED,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobStatus.COMPLETED,
      active: selectedStatus === JobStatus.COMPLETED,
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
