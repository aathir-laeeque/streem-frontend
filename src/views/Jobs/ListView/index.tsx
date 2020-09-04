import { useTabs } from '#components';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Composer } from './styles';
import TabContent from './TabContent';
import { JobStatus, ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!job?.length) {
      dispatch(fetchProperties({ type: 'JOB' }));
    }
  }, []);

  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: JobStatus.UNASSIGNED,
      active: true,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobStatus.ASSIGNED,
      active: false,
      TabContent,
      passThroughTabContentProps,
    },
    {
      label: JobStatus.COMPLETED,
      active: false,
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
