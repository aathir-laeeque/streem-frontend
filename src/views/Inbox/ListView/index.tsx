import { useTabs } from '#components';
import { ComposerEntity } from '#Composer-new/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetInbox } from './actions';

import { Composer } from './styles';
import TabContent from './TabContent';
import { InboxStatus, ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const { isIdle } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      if (!job?.length) {
        dispatch(fetchProperties({ type: ComposerEntity.JOB }));
      }

      return () => {
        dispatch(resetInbox());
      };
    }
  }, [isIdle]);

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
