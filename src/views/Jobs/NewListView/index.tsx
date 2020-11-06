import useTabsNew from '#components/shared/useTabsNew';
import React, { FC } from 'react';

import TabContent from './NewTabContent';
import { ViewWrapper } from './styles';
import {
  AssignedJobStates,
  CompletedJobStates,
  ListViewProps,
  UnassignedJobStates,
} from './types';

const ChecklistListView: FC<ListViewProps> = () => {
  const { renderTabHeader, renderTabContent } = useTabsNew({
    tabs: [
      {
        label: 'Unassigned',
        values: [UnassignedJobStates.UNASSIGNED],
        tabContent: TabContent,
      },
      {
        label: 'Assigned',
        values: [AssignedJobStates.ASSIGNED, AssignedJobStates.IN_PROGRESS],
        tabContent: TabContent,
      },
      {
        label: 'Completed',
        values: [
          CompletedJobStates.COMPLETED,
          CompletedJobStates.COMPLETED_WITH_EXCEPTION,
        ],
        tabContent: TabContent,
      },
    ],
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">Jobs</div>
        <div className="sub-heading">
          Create, Assign and view Completed Jobs
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
