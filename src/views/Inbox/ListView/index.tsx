import useTabsNew from '#components/shared/useTabsNew';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { fetchProperties } from '#store/properties/actions';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { resetInbox } from './actions';
import { ViewWrapper } from './styles';
import TabContent from './TabContent';
import { InboxState, ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const { job } = useTypedSelector((state) => state.properties);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!job?.length) {
      dispatch(fetchProperties({ type: ComposerEntity.JOB }));
    }

    return () => {
      dispatch(resetInbox());
    };
  }, []);

  const { renderTabHeader, renderTabContent } = useTabsNew({
    tabs: [
      {
        label: InboxState.MYINBOX,
        tabContent: TabContent,
      },
    ],
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">Inbox</div>
        <div className="sub-heading">View and execute Jobs assigned to you</div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
