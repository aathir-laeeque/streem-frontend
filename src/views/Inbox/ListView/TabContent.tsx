import {
  DataTable,
  fetchDataParams,
  PaginatedFetchData,
  Pagination,
  ProgressBar,
  SearchFilter,
  Select,
  ToggleSwitch,
} from '#components';
import { fetchParameters, fetchParametersSuccess } from '#PrototypeComposer/Activity/actions';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import DetailsPopover from '#views/Jobs/Components/DetailsPopover';
import AssigneesColumn from '#views/Jobs/ListView/AssigneesColumn';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { AssignedJobStates, CompletedJobStates, Job } from '#views/Jobs/ListView/types';
import { CircularProgress } from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import { navigate as navigateTo } from '@reach/router';
import { debounce, keyBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInbox, setSelectedState } from './actions';
import { ListViewState, TabViewProps } from './types';

const TabContent: FC<TabViewProps> = ({ navigate = navigateTo, label }) => {
  const { jobs, loading: jobDataLoading }: ListViewState = useTypedSelector(
    (state) => state.inboxListView,
  );

  const { selectedFacility: { id: facilityId = '' } = {}, selectedUseCase } = useTypedSelector(
    (state) => state.auth,
  );
  const {
    checklists,
    pageable: checklistPageable,
    loading: checklistsLoading,
  } = useTypedSelector((state) => state.checklistListView);
  const {
    parameters: {
      parameters: { list: parametersList, pageable: parameterPageable },
    },
  } = useTypedSelector((state) => state.prototypeComposer);

  const reducerLabel = label.toLowerCase().split(' ').join('');

  const [filterFields, setFilterFields] = useState<FilterField[]>([
    {
      field: 'useCaseId',
      op: FilterOperators.EQ,
      values: [selectedUseCase?.id!],
    },
    {
      field: 'state',
      op: FilterOperators.ANY,
      values: [
        AssignedJobStates.ASSIGNED,
        AssignedJobStates.IN_PROGRESS,
        AssignedJobStates.BLOCKED,
      ],
    },
  ]);

  const { pageable, list } = jobs[reducerLabel];

  const dispatch = useDispatch();

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    dispatch(
      fetchInbox(
        {
          facilityId,
          page,
          size,
          sort: 'createdAt,desc',
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [...filters],
          }),
        },
        reducerLabel,
      ),
    );
  };

  useEffect(() => {
    fetchChecklistData({ page: 0 });
    return () => {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    };
  }, []);

  useEffect(() => {
    if (selectedUseCase?.id) {
      fetchData();
      dispatch(setSelectedState(reducerLabel));
    }
  }, [selectedUseCase?.id, filterFields]);

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
    ...parametersList.map((parameter) => {
      return {
        id: parameter.id,
        label: parameter.label,
        minWidth: 125,
        maxWidth: 180,
        format: (item: Job) => <DetailsPopover item={item} parameterId={parameter.id} />,
      };
    }),
  ];

  const fetchChecklistData = ({
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    query = '',
  }: fetchDataParams) => {
    const filters = JSON.stringify({
      op: FilterOperators.AND,
      fields: [
        { field: 'state', op: FilterOperators.EQ, values: ['PUBLISHED'] },
        { field: 'archived', op: FilterOperators.EQ, values: [false] },
        ...(query ? [{ field: 'name', op: FilterOperators.LIKE, values: [query] }] : []),
        {
          field: 'useCaseId',
          op: FilterOperators.EQ,
          values: [selectedUseCase?.id],
        },
      ],
    });
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }, page === 0));
  };

  const fetchParametersListData = async (params: PaginatedFetchData = {}, option) => {
    const { page = DEFAULT_PAGE_NUMBER, size = 250 } = params;
    if (option?.id) {
      dispatch(
        fetchParameters(option.id, {
          page,
          size,
          filters: {
            op: FilterOperators.AND,
            fields: [
              {
                field: 'targetEntityType',
                op: FilterOperators.EQ,
                values: [TargetEntityType.PROCESS],
              },
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
            ],
          },
          sort: 'id,desc',
        }),
      );
    }
  };

  const selectChangeHandler = (option) => {
    if (option) {
      const selectedFilterField = {
        field: 'checklist.id',
        op: FilterOperators.EQ,
        values: [option.id],
      };
      setFilterFields((currentFields) => {
        const updatedFilterFields = [
          ...currentFields.filter((field) => field.field !== selectedFilterField?.field),
          selectedFilterField,
        ];
        return updatedFilterFields;
      });
      fetchParametersListData({ page: DEFAULT_PAGE_NUMBER, size: DEFAULT_PAGE_SIZE }, option);
    } else {
      setFilterFields((currentFields) =>
        currentFields.filter((curr) => curr.field !== 'checklist.id'),
      );
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!checklistPageable.last) fetchChecklistData({ page: checklistPageable.page + 1 });
  };

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
          ]}
          updateFilterFields={(fields) => {
            setFilterFields((currentFields) => {
              const updatedFilterFields = [
                ...currentFields.filter((field) => field.field !== fields?.[0].field),
                ...fields,
              ];
              return updatedFilterFields;
            });
          }}
        />
        <Select
          className="process-filter"
          backspaceRemovesValue={false}
          hideSelectedOptions={false}
          onChange={(newValue) => {
            selectChangeHandler(newValue);
          }}
          isLoading={checklistsLoading}
          onInputChange={debounce((searchedValue: string, actionMeta) => {
            if (searchedValue !== actionMeta.prevInputValue)
              fetchChecklistData({ page: DEFAULT_PAGE_NUMBER, query: searchedValue });
          }, 500)}
          options={checklists.map((currList) => ({ ...currList, label: currList.name }))}
          placeholder="Processes"
          tabSelectsValue={false}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          optional
        />
        <ToggleSwitch
          offLabel="Show Completed"
          onLabel="Showing Completed"
          checked={filterFields.find((field) => field.field === 'state')?.values?.length === 2}
          onChange={(isChecked) =>
            setFilterFields((currentFields) =>
              currentFields.map((field) => ({
                ...field,
                ...(field.field === 'state'
                  ? {
                      values: isChecked
                        ? [
                            CompletedJobStates.COMPLETED,
                            CompletedJobStates.COMPLETED_WITH_EXCEPTION,
                          ]
                        : [
                            AssignedJobStates.ASSIGNED,
                            AssignedJobStates.BLOCKED,
                            AssignedJobStates.IN_PROGRESS,
                          ],
                    }
                  : { values: field.values }),
              })),
            )
          }
        />
      </div>
      <div
        style={{
          display: jobDataLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
      </div>
      <div
        style={{
          ...(jobDataLoading ? { display: 'none' } : { display: 'contents' }),
        }}
      >
        <DataTable
          columns={columns}
          rows={list.map((item) => {
            return {
              ...item,
              parameterValues: keyBy(item.parameterValues, 'id'),
            };
          })}
        />
        <Pagination pageable={pageable} fetchData={fetchData} />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
