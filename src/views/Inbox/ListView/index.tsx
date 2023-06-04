import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { FilterOperators } from '#utils/globalTypes';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { AssignedJobStates, CompletedJobStates } from '#views/Jobs/ListView/types';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InboxContent from './InboxContent';
import { resetInbox } from './actions';
import { InboxState, ListViewProps } from './types';
import { GeneralHeader } from '#components';
import moment from 'moment';

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
        label: InboxState.NOT_STARTED,
        tabContent: InboxContent,
        values: {
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
        },
      },
      {
        label: InboxState.ON_GOING,
        tabContent: InboxContent,
        values: {
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
        },
      },
      {
        label: InboxState.COMPLETED,
        tabContent: InboxContent,
        values: {
          baseFilters: [
            {
              field: 'state',
              op: FilterOperators.ANY,
              values: [CompletedJobStates.COMPLETED, CompletedJobStates.COMPLETED_WITH_EXCEPTION],
            },
          ],
        },
      },
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
