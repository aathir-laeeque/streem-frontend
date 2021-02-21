import {
  ExtraColumn,
  NewListView,
  ProgressBar,
  SearchFilter,
} from '#components';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
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
import { TabContentWrapper } from './styles';
import { ListViewState, TabViewProps } from './types';

// const DEFAULT_PAGE_NUMBER = 0;
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
                textOverflow: 'ellipsis',
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
          <div
            className="list-card-columns"
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
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
            <span
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontSize: '12px',
                lineHeight: '20px',
              }}
              title={title}
            >
              {title}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Assignees',
      template: function renderComp(item: Job) {
        return <AssigneesColumn assignees={item.assignees} />;
      },
    },
    {
      header: 'Task Completed',
      template: function renderComp({
        completedTasks = 0,
        totalTasks = 0,
      }: Job) {
        const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

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
        beforeColumns={beforeColumns as ExtraColumn[]}
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
