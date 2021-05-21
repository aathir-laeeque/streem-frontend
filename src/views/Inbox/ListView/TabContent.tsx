import { DataTable, ProgressBar, SearchFilter } from '#components';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/NewListView/styles';
import { Job } from '#views/Jobs/NewListView/types';
import { ArrowLeft, ArrowRight, FiberManualRecord } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import AssigneesColumn from '../../Jobs/NewListView/AssignessColumn';
import {
  AssignedJobStates,
  CompletedJobStates,
} from '../../Jobs/NewListView/types';
import { fetchInbox, setSelectedState } from './actions';
import { ListViewState, TabViewProps } from './types';

const DEFAULT_PAGE_SIZE = 10;

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { jobs }: ListViewState = useTypedSelector(
    (state) => state.inboxListView,
  );

  const { selectedFacility: { id: facilityId = '' } = {} } = useTypedSelector(
    (state) => state.auth,
  );
  const reducerLabel = label.toLowerCase().split(' ').join('');

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const { pageable, list } = jobs[reducerLabel];

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(0, 10);
    dispatch(setSelectedState(reducerLabel));
  }, []);

  const fetchData = (page: number, size: number) => {
    dispatch(
      fetchInbox(
        {
          facilityId,
          page,
          size,
          sort: 'createdAt,desc',
          fields: JSON.stringify({ op: 'AND', fields: filterFields }),
        },
        reducerLabel,
      ),
    );
  };

  useEffect(() => {
    dispatch(
      fetchInbox(
        {
          facilityId,
          page: 0,
          size: 10,
          sort: 'createdAt,desc',
          filters: JSON.stringify({ op: 'AND', fields: filterFields }),
        },
        reducerLabel,
      ),
    );
  }, [filterFields]);

  const showPaginationArrows = pageable.totalPages > 10;

  const columns = [
    {
      id: 'state',
      label: 'State',
      minWidth: 166,
      format: function renderComp({ state }: Job) {
        const isJobBlocked = state === AssignedJobStates.BLOCKED;
        const isJobStarted = state === AssignedJobStates.IN_PROGRESS;

        const isJobCompleted = state === CompletedJobStates.COMPLETED;

        const isCompletedWithException =
          state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

        const title = isJobCompleted
          ? 'Completed'
          : isCompletedWithException
          ? 'Completed with Exception'
          : isJobBlocked
          ? 'Approval Pending'
          : isJobStarted
          ? 'Started'
          : 'Not Started';

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FiberManualRecord
              className="icon"
              style={{
                fontSize: '20px',
                color: isJobCompleted
                  ? '#5aa700'
                  : isJobStarted
                  ? '#1d84ff'
                  : '#f7b500',
              }}
            />
            <span title={title}>{title}</span>
          </div>
        );
      },
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 240,
      format: function renderComp({
        id,
        checklist: { id: checklistId, name: checklistName },
      }: Job) {
        return (
          <span
            className="primary"
            onClick={() => {
              navigate(`/inbox/${id}`, { state: { checklistId } });
            }}
            title={checklistName}
          >
            {checklistName}
          </span>
        );
      },
    },
    {
      id: 'assignees',
      label: 'Assignees',
      minWidth: 152,
      format: function renderComp(item: Job) {
        return <AssigneesColumn assignees={item.assignees} />;
      },
    },
    {
      id: 'task-completed',
      label: 'Task Completed',
      minWidth: 152,
      format: function renderComp({ completedTasks = 0, totalTasks = 0 }: Job) {
        const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

        return (
          <div className="task-progress">
            <ProgressBar whiteBackground percentage={percentage} />
            <span>
              {completedTasks} of {totalTasks} Tasks
            </span>
          </div>
        );
      },
    },
    {
      id: 'code',
      label: 'Job ID',
      minWidth: 152,
    },
    ...job.map((jobProperty) => {
      return {
        id: jobProperty.id,
        label: jobProperty.placeHolder,
        minWidth: 125,
        maxWidth: 180,
      };
    }),
  ];

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          key={label}
          showdropdown
          dropdownOptions={[
            {
              label: 'Name',
              value: 'checklist.name',
              field: 'checklist.name',
              operator: 'LIKE',
            },
            ...job.map(({ placeHolder, id }) => ({
              label: placeHolder,
              value: id,
              field: 'jobPropertyValues.propertiesId',
              operator: 'EQ',
            })),
          ]}
          updateFilterFields={(fields) => setFilterFields([...fields])}
        />
      </div>
      <DataTable
        columns={columns}
        rows={list.map((item) => {
          return {
            ...item,
            ...job.reduce<Record<string, string>>((acc, jobProperty) => {
              acc[jobProperty.id] = item.properties?.[jobProperty.name];
              return acc;
            }, {}),
          };
        })}
      />
      <div className="pagination">
        <ArrowLeft
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page > 0) {
              fetchData(pageable.page - 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
        {Array.from({ length: pageable.totalPages }, (_, i) => i)
          .slice(
            Math.floor(pageable.page / 10) * 10,
            Math.floor(pageable.page / 10) * 10 + 10,
          )
          .map((el) => (
            <span
              key={el}
              className={pageable.page === el ? 'active' : ''}
              onClick={() => fetchData(el, DEFAULT_PAGE_SIZE)}
            >
              {el + 1}
            </span>
          ))}
        <ArrowRight
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page < pageable.totalPages - 1) {
              fetchData(pageable.page + 1, DEFAULT_PAGE_SIZE);
            }
          }}
        />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
