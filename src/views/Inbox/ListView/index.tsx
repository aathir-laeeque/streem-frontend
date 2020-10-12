import { useTabs } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Composer } from './styles';
import TabContent from './TabContent';
import { InboxStatus, ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!job?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.JOB }));
    }
  }, []);

  const passThroughTabContentProps = {};
  const { renderTabsContent, renderTabsHeader } = useTabs([
    {
      label: InboxStatus.MYINBOX,
      active: true,
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
