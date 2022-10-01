import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
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

  const { renderTabHeader, renderTabContent } = useTabs({
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
