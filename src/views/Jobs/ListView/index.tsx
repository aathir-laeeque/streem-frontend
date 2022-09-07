import useTabsNew from '#components/shared/useTabsNew';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import TabContent from './TabContent';
import { ViewWrapper } from './styles';
import { AssignedJobStates, CompletedJobStates, ListViewProps, UnassignedJobStates } from './types';

const JobListView: FC<ListViewProps> = () => {
  const { selectedUseCase } = useTypedSelector((state) => state.auth);

  const { renderTabHeader, renderTabContent } = useTabsNew({
    tabs: [
      {
        label: 'Unassigned',
        values: [UnassignedJobStates.UNASSIGNED],
        tabContent: TabContent,
      },
      {
        label: 'Assigned',
        values: [
          AssignedJobStates.ASSIGNED,
          AssignedJobStates.IN_PROGRESS,
          AssignedJobStates.BLOCKED,
        ],
        tabContent: TabContent,
      },
      {
        label: 'Completed',
        values: [CompletedJobStates.COMPLETED, CompletedJobStates.COMPLETED_WITH_EXCEPTION],
        tabContent: TabContent,
      },
    ],
  });

  return (
    <ViewWrapper>
      <div className="header">
        <div className="heading">{selectedUseCase?.label} - Jobs</div>
        <div className="sub-heading">Create, Assign and view Completed Jobs</div>
      </div>

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default JobListView;
