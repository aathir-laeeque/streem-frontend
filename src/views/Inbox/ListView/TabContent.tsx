import { DataTable, ProgressBar, SearchFilter } from '#components';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/NewListView/styles';
import { Job } from '#views/Jobs/NewListView/types';
import { Chip, CircularProgress } from '@material-ui/core';
import { ArrowLeft, ArrowRight, FiberManualRecord } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import AssigneesColumn from '../../Jobs/NewListView/AssignessColumn';
import { AssignedJobStates, CompletedJobStates } from '../../Jobs/NewListView/types';
import { fetchInbox, setSelectedState } from './actions';
import { ListViewState, TabViewProps } from './types';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { jobs, loading: jobDataLoading }: ListViewState = useTypedSelector(
    (state) => state.inboxListView,
  );
  const { list: jobProperties, loading: jobPropertiesLoading } = useTypedSelector(
    (state) => state.properties[ComposerEntity.JOB],
  );

  const { selectedFacility: { id: facilityId = '' } = {}, selectedUseCase } = useTypedSelector(
    (state) => state.auth,
  );
  const reducerLabel = label.toLowerCase().split(' ').join('');

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const { pageable, list } = jobs[reducerLabel];

  const dispatch = useDispatch();

  const fetchData = (
    filtersArr: FilterField[],
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
  ) => {
    dispatch(
      fetchInbox(
        {
          facilityId,
          page,
          size,
          sort: 'createdAt,desc',
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              ...filtersArr,
              {
                field: 'useCaseId',
                op: FilterOperators.EQ,
                values: [selectedUseCase?.id],
              },
            ],
          }),
        },
        reducerLabel,
      ),
    );
  };

  useEffect(() => {
    if (selectedUseCase?.id) {
      fetchData(filterFields);
      dispatch(setSelectedState(reducerLabel));
    }
  }, [selectedUseCase?.id]);

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

        const isCompletedWithException = state === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

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
                color: isJobCompleted ? '#5aa700' : isJobStarted ? '#1d84ff' : '#f7b500',
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
    ...jobProperties.map((jobProperty) => {
      return {
        id: jobProperty.id,
        label: jobProperty.label,
        minWidth: 125,
        maxWidth: 180,
      };
    }),
    {
      id: 'moreDetails',
      label: 'More Details',
      minWidth: 152,
      format: (item: Job) => {
        console.log('item', item);
        if (!item?.['relations']?.length) return '-';
        return (
          <>
            {item['relations'].map((relation) => {
              const content = relation.targets
                .map((target) => `${target.displayName} - ${target.externalId}`)
                .join('\n');
              return (
                <Chip
                  key={relation.id}
                  style={{ margin: '4px 8px 0 0' }}
                  label={
                    <span style={{ cursor: 'pointer' }} title={content}>
                      {relation.displayName} {' : '}
                      {content.length > 10 ? `${content.substring(0, 10)}...` : content}
                    </span>
                  }
                />
              );
            })}
          </>
        );
      },
    },
  ];

  return (
    <TabContentWrapper>
      <div className="filters">
        <SearchFilter
          label={label}
          showDropdown
          dropdownOptions={[
            {
              label: 'Name',
              value: 'checklist.name',
              field: 'checklist.name',
              operator: FilterOperators.LIKE,
            },
            ...jobProperties.map(({ label, id }) => ({
              label,
              value: id,
              field: 'jobPropertyValues.facilityUseCasePropertyMapping.propertiesId',
              operator: FilterOperators.EQ,
            })),
          ]}
          updateFilterFields={(fields) => {
            setFilterFields([...fields]);
            fetchData([...fields]);
          }}
        />
      </div>
      <div
        style={{
          display: jobDataLoading || jobPropertiesLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
      </div>
      <div
        style={{
          ...(jobDataLoading || jobPropertiesLoading
            ? { display: 'none' }
            : { display: 'contents' }),
        }}
      >
        <DataTable
          columns={columns}
          rows={list.map((item) => {
            return {
              ...item,
              ...item.properties!.reduce<Record<string, string>>((acc, itemProperty) => {
                acc[itemProperty.id] = itemProperty.value;
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
                fetchData(filterFields, pageable.page - 1, DEFAULT_PAGE_SIZE);
              }
            }}
          />
          {Array.from({ length: pageable.totalPages }, (_, i) => i)
            .slice(Math.floor(pageable.page / 10) * 10, Math.floor(pageable.page / 10) * 10 + 10)
            .map((el) => (
              <span
                key={el}
                className={pageable.page === el ? 'active' : ''}
                onClick={() => fetchData(filterFields, el, DEFAULT_PAGE_SIZE)}
              >
                {el + 1}
              </span>
            ))}
          <ArrowRight
            className={`icon ${showPaginationArrows ? '' : 'hide'}`}
            onClick={() => {
              if (pageable.page < pageable.totalPages - 1) {
                fetchData(filterFields, pageable.page + 1, DEFAULT_PAGE_SIZE);
              }
            }}
          />
        </div>
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
