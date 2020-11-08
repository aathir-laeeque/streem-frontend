import {
  ListViewComponent,
  ProgressBar,
  NewListView,
  SearchFilter,
} from '#components';
import { useTypedSelector } from '#store';
import JobCard from '#views/Jobs/Compoents/JobCard';
import { Job } from '#views/Jobs/types';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiberManualRecord, ArrowLeft, ArrowRight } from '@material-ui/icons';

import { fetchInbox, setSelectedState } from './actions';
import { TabContentWrapper } from './styles';
import { ListViewState, TabViewProps } from './types';
import {
  AssignedJobStates,
  CompletedJobStates,
} from '../../Jobs/NewListView/types';
import AssigneesColumn from '../../Jobs/NewListView/AssignessColumn';
import { FilterField } from '#utils/globalTypes';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { job } = useTypedSelector((state) => state.properties);
  const { jobs, loading }: ListViewState = useTypedSelector(
    (state) => state.inboxListView,
  );

  const { isIdle } = useTypedSelector((state) => state.auth);
  const reduerLabel = label.toLowerCase().split(' ').join('');

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const { pageable, list } = jobs[reduerLabel];

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isIdle) {
      fetchData(0, 10);
      dispatch(setSelectedState(reduerLabel));
    }
  }, [isIdle]);

  const fetchData = (page: number, size: number) => {
    dispatch(
      fetchInbox(
        {
          page,
          size,
          sort: 'createdAt,desc',
          fields: JSON.stringify({ op: 'AND', fields: filterFields }),
        },
        reduerLabel,
      ),
    );
  };

  useEffect(() => {
    dispatch(
      fetchInbox(
        {
          page: 0,
          size: 10,
          sort: 'createdAt,desc',
          filters: JSON.stringify({ op: 'AND', fields: filterFields }),
        },
        reduerLabel,
      ),
    );
  }, [filterFields]);

  const beforeColumns = [
    {
      header: 'Name',
      template: function renderComp({
        id,
        checklist: { id: checklistId, name: checklistName },
      }: Job) {
        return (
          <div className="list-card-columns">
            <span
              className="list-title"
              onClick={() => {
                navigate(`/inbox/${id}`, { state: { checklistId } });
              }}
              style={{
                width: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {checklistName}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Job Status',
      template: function renderComp({ state }: Job) {
        const isJobStarted = state === AssignedJobStates.IN_PROGRESS;

        const isJobCompleted = state === CompletedJobStates.COMPLETED;

        const isCompletedWithException =
          state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

        return (
          <div className="list-card-columns">
            <FiberManualRecord
              className="icon"
              style={{
                color: isJobCompleted
                  ? '#5aa700'
                  : isJobStarted
                  ? '#1d84ff'
                  : '#f7b500',
              }}
            />
            <span
              style={{
                width: '100px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {isJobCompleted
                ? 'Completed'
                : isCompletedWithException
                ? 'Completed with Exception'
                : isJobStarted
                ? 'Started'
                : 'Not Started'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Assignees',
      template: function renderComp(item: Job) {
        return <AssigneesColumn jobId={item.id} />;
      },
    },
    {
      header: 'Task Completed',
      template: function renderComp({ completedTasks, totalTasks }: Job) {
        const percentage = (completedTasks / totalTasks) * 100;
        return (
          <div className="list-card-columns task-progress">
            <ProgressBar whiteBackground percentage={percentage} />
            <span>
              {completedTasks} of {totalTasks} Tasks
            </span>
          </div>
        );
      },
    },
    {
      header: 'Job ID',
      template: function renderComp(item: Job) {
        return (
          <div className="list-card-columns" key={item.id}>
            {item.code}
          </div>
        );
      },
    },
  ];

  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          showdropdown
          dropdownOptions={[
            {
              label: 'Name',
              value: 'checklist.name',
              field: 'checklist.name',
              operator: 'LIKE',
            },
            ...job.map(({ placeHolder, name }) => ({
              label: placeHolder,
              value: name,
              field: 'jobPropertyValues.property.name',
              operator: 'EQ',
            })),
          ]}
          updateFilterFields={(_fields) => {
            setFilterFields((_currentFields) => [
              ..._currentFields.filter(
                (field) =>
                  !_fields.some((newField) => newField.field === field.field),
              ),
              ..._fields,
            ]);
          }}
        />
      </div>
      <NewListView
        properties={job}
        fetchData={fetchData}
        isLast={pageable.last}
        currentPage={pageable.page}
        data={list}
        beforeColumns={beforeColumns}
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
        {Array.from(
          { length: Math.min(pageable.totalPages, 10) },
          (_, i) => i,
        ).map((el) => (
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
