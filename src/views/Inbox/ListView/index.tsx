import useTabsNew from '#components/shared/useTabsNew';
import { useTypedSelector } from '#store';
import { ViewWrapper } from '#views/Jobs/NewListView/styles';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetInbox } from './actions';
import TabContent from './TabContent';
import { InboxState, ListViewProps } from './types';

const ListView: FC<ListViewProps> = () => {
  const dispatch = useDispatch();
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  useEffect(() => {
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
        <div className="heading">{selectedUseCase?.label} - Inbox</div>
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
