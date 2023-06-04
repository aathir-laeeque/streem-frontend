import { LogType } from '#PrototypeComposer/checklist.types';
import { GeneralHeader } from '#components';
import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { FilterOperators } from '#utils/globalTypes';
import moment from 'moment';
import React, { FC } from 'react';
import JobsContent from './JobsContent';
import { ViewWrapper } from './styles';
import { AssignedJobStates, CompletedJobStates, ListViewProps, UnassignedJobStates } from './types';

export const commonColumns = [
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job Start',
    triggerType: 'JOB_START_TIME',
    orderTree: 1,
  },
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job Created At',
    triggerType: 'JOB_CREATED_AT',
    orderTree: 2,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Created By',
    triggerType: 'JOB_CREATED_BY',
    orderTree: 3,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Id',
    triggerType: 'JOB_ID',
    orderTree: 4,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job State',
    triggerType: 'JOB_STATE',
    orderTree: 5,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Checklist Id',
    triggerType: 'CHK_ID',
    orderTree: 6,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Checklist Name',
    triggerType: 'CHK_NAME',
    orderTree: 7,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Started By',
    triggerType: 'JOB_STARTED_BY',
    orderTree: 8,
  },
  {
    id: '-1',
    type: LogType.DATE,
    displayName: 'Job End',
    triggerType: 'JOB_END_TIME',
    orderTree: 9,
  },
  {
    id: '-1',
    type: LogType.TEXT,
    displayName: 'Job Ended By',
    triggerType: 'JOB_ENDED_BY',
    orderTree: 10,
  },
];

const JobListView: FC<ListViewProps> = ({ location }) => {
  const { selectedUseCase } = useTypedSelector((state) => state.auth);
  const processFilter = location?.state?.processFilter
    ? location?.state?.processFilter?.schedulerId
      ? [
          {
            field: 'checklist.id',
            op: FilterOperators.EQ,
            values: [location.state.processFilter.processId],
          },
          {
            field: 'schedulerId',
            op: FilterOperators.EQ,
            values: [location.state.processFilter.schedulerId],
          },
        ]
      : [
          {
            field: 'checklist.id',
            op: FilterOperators.EQ,
            values: [location.state.processFilter.id],
          },
        ]
    : [];

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: 'Created',
        values: {
          baseFilters: [
            {
              field: 'state',
              op: FilterOperators.ANY,
              values: [UnassignedJobStates.UNASSIGNED, AssignedJobStates.ASSIGNED],
            },
            ...processFilter,
          ],
          cards: [
            {
              label: 'Scheduled',
              className: 'blue',
              filters: [
                {
                  field: 'isScheduled',
                  op: FilterOperators.EQ,
                  values: [true],
                },
              ],
            },
            {
              label: 'Unscheduled',
              className: 'grey',
              filters: [
                {
                  field: 'isScheduled',
                  op: FilterOperators.EQ,
                  values: [false],
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
          processFilter: location?.state?.processFilter,
        },
        tabContent: JobsContent,
      },
      {
        label: 'On Going',
        values: {
          baseFilters: [
            {
              field: 'state',
              op: FilterOperators.ANY,
              values: [AssignedJobStates.IN_PROGRESS, AssignedJobStates.BLOCKED],
            },
            ...processFilter,
          ],
          cards: [
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
          processFilter: location?.state?.processFilter,
        },
        tabContent: JobsContent,
      },
      {
        label: 'Completed',
        values: {
          baseFilters: [
            {
              field: 'state',
              op: FilterOperators.ANY,
              values: [CompletedJobStates.COMPLETED, CompletedJobStates.COMPLETED_WITH_EXCEPTION],
            },
          ],
          processFilter: location?.state?.processFilter,
        },
        tabContent: JobsContent,
      },
    ],
  });

  const selectedProcessName = location?.state?.processFilter?.processName;

  return (
    <ViewWrapper>
      <GeneralHeader
        heading={`${selectedUseCase?.label} - Jobs ${
          selectedProcessName ? `for ${selectedProcessName}` : ''
        }`}
        subHeading="Create, Assign and view Completed Jobs"
      />

      <div className="list-table">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </ViewWrapper>
  );
};
export default JobListView;
