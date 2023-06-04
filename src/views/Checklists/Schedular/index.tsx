import { GeneralHeader } from '#components';
import useTabs from '#components/shared/useTabs';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import React, { FC } from 'react';
import TabContent from './TabContent';

const SchedularListView: FC<any> = ({ location }) => {
  const processData = location?.state?.process;
  const { renderTabContent } = useTabs({
    tabs: [{ label: '', tabContent: TabContent, values: processData }],
  });
  return (
    <ViewWrapper>
      <GeneralHeader heading={`${processData?.name} Schedule`} />
      <div className="list-table">{renderTabContent()}</div>
    </ViewWrapper>
  );
};
export default SchedularListView;
