import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import React, { FC } from 'react';
import TabContent from './TabContent';
import { ReportState } from './types';

const ListView = () => {
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: ReportState.Reports,
        tabContent: TabContent,
      },
    ],
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">{selectedUseCase?.label} - Reports</div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
