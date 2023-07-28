import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { FilterOperators } from '#utils/globalTypes';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { AssignedJobStates, CompletedJobStates } from '#views/Jobs/ListView/types';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InboxContent from './InboxContent';
import VerificationContent from './VerificationsContent';
import ApprovalsContent from './ApprovalsContent';
import { resetInbox } from './actions';
import { InboxState, ListViewProps } from './types';
import { GeneralHeader, StyledTabs } from '#components';
import moment from 'moment';
import styled from 'styled-components';
import checkPermission from '#services/uiPermissions';

const InboxJobsWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;

  .jobs-tabs-list {
    .MuiTab-root {
      max-width: 160px;
    }
  }

  .jobs-tabs {
    width: 100%;
  }

  .jobs-tabs-panel {
    padding: 16px 0px 0px;
    height: calc(100% - 49px);

    > div {
      height: 100%;

      .job-list {
        padding-top: 16px;
      }
    }
  }
`;

const ListView: FC<ListViewProps> = () => {
  const dispatch = useDispatch();
  const { selectedUseCase, userId } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(resetInbox());
    };
  }, []);

  const jobTabs = () => {
    return (
      <InboxJobsWrapper>
        <StyledTabs
          containerProps={{
            className: 'jobs-tabs',
          }}
          tabListProps={{
            className: 'jobs-tabs-list',
          }}
          panelsProps={{
            className: 'jobs-tabs-panel',
          }}
          tabs={[
            {
              value: '0',
              label: InboxState.NOT_STARTED,
              panelContent: (
                <InboxContent
                  label={InboxState.NOT_STARTED}
                  values={{
                    baseFilters: [
                      {
                        field: 'state',
                        op: FilterOperators.ANY,
                        values: [AssignedJobStates.ASSIGNED],
                      },
                    ],
                    cards: [
                      {
                        label: 'Scheduled',
                        className: 'blue',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.GT,
                            values: [0],
                          },
                        ],
                      },
                      {
                        label: 'Unscheduled',
                        className: 'grey',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.IS_NOT_SET,
                            values: [],
                          },
                        ],
                      },
                      {
                        label: 'Over Due',
                        className: 'orange',
                        filters: [
                          {
                            field: 'expectedEndDate',
                            op: FilterOperators.LT,
                            values: [moment(moment.now()).unix().toString()],
                          },
                        ],
                      },
                      {
                        label: 'Start Delayed',
                        className: 'yellow',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.LT,
                            values: [moment(moment.now()).unix().toString()],
                          },
                        ],
                      },
                    ],
                  }}
                />
              ),
            },
            {
              value: '1',
              label: InboxState.ON_GOING,
              panelContent: (
                <InboxContent
                  label={InboxState.ON_GOING}
                  values={{
                    baseFilters: [
                      {
                        field: 'state',
                        op: FilterOperators.ANY,
                        values: [AssignedJobStates.IN_PROGRESS, AssignedJobStates.BLOCKED],
                      },
                    ],
                    cards: [
                      {
                        label: 'Scheduled',
                        className: 'blue',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.GT,
                            values: [0],
                          },
                        ],
                      },
                      {
                        label: 'Unscheduled',
                        className: 'grey',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.IS_NOT_SET,
                            values: [],
                          },
                        ],
                      },
                      {
                        label: 'Over Due',
                        className: 'orange',
                        filters: [
                          {
                            field: 'expectedEndDate',
                            op: FilterOperators.LT,
                            values: [moment(moment.now()).unix().toString()],
                          },
                        ],
                      },
                      {
                        label: 'Start Delayed',
                        className: 'yellow',
                        filters: [
                          {
                            field: 'expectedStartDate',
                            op: FilterOperators.LT,
                            values: [moment(moment.now()).unix().toString()],
                          },
                        ],
                      },
                      {
                        label: 'Pending Approval',
                        className: 'yellow',
                        filters: [
                          {
                            field: 'state',
                            op: FilterOperators.EQ,
                            values: [AssignedJobStates.BLOCKED],
                          },
                        ],
                      },
                    ],
                  }}
                />
              ),
            },
            {
              value: '2',
              label: InboxState.COMPLETED,
              panelContent: (
                <InboxContent
                  label={InboxState.COMPLETED}
                  values={{
                    baseFilters: [
                      {
                        field: 'state',
                        op: FilterOperators.ANY,
                        values: [
                          CompletedJobStates.COMPLETED,
                          CompletedJobStates.COMPLETED_WITH_EXCEPTION,
                        ],
                      },
                    ],
                  }}
                />
              ),
            },
          ]}
        />
      </InboxJobsWrapper>
    );
  };

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: 'Jobs',
        tabContent: jobTabs,
      },
      {
        label: 'Verifications',
        tabContent: VerificationContent,
        values: {
          userId,
          isJobOpen: false,
        },
      },
      ...(checkPermission(['approvals', 'view'])
        ? [
            {
              label: 'Approvals',
              tabContent: ApprovalsContent,
            },
          ]
        : []),
    ],
  });

  return (
    <ViewWrapper>
      <GeneralHeader
        heading={`${selectedUseCase?.label} - Inbox`}
        subHeading="View and execute Jobs assigned to you"
      />
      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};

export default ListView;
