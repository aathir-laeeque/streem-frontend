import useTabsNew from '#components/shared/useTabsNew';
import { useTypedSelector } from '#store';
import { ViewWrapper } from '#views/Jobs/NewListView/styles';
import React, { FC } from 'react';
import TabContent from './TabContent';
import { ListViewProps } from './types';

const ChecklistListView: FC<ListViewProps> = ({}) => {
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  const { renderTabHeader, renderTabContent } = useTabsNew({
    tabs: [
      { label: 'published', tabContent: TabContent },
      { label: 'prototype', tabContent: TabContent },
    ],
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">{selectedUseCase?.label} - Checklists</div>
        <div className="sub-heading">
          Create, view or edit your Checklists and Prototypes
        </div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default ChecklistListView;
