import {
  Button,
  DataTable,
  fetchDataParams,
  PaginatedFetchData,
  Pagination,
  ProgressBar,
  SearchFilter,
  Select,
  TabContentProps,
  ToggleSwitch,
  UsersFilter,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { fetchParameters, fetchParametersSuccess } from '#PrototypeComposer/Activity/actions';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import checkPermission, { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store/helpers';
import { User } from '#store/users/types';
import { ALL_FACILITY_ID, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { CircularProgress } from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce, keyBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DetailsPopover from '../Components/DetailsPopover';
import { createJob, fetchJobs } from './actions';
import AssigneesColumn from './AssigneesColumn';
import { TabContentWrapper } from './styles';
import {
  AssignedJobStates,
  CompletedJobStates,
  Job,
  JobStateType,
  UnassignedJobStates,
} from './types';

const getBaseFilter = (values: string[]): FilterField[] => [
  {
    field: 'state',
    op: values.length === 1 ? FilterOperators.EQ : FilterOperators.ANY,
    values,
  },
];

const TabContent: FC<TabContentProps> = ({ label, values }) => {
  const dispatch = useDispatch();
  const componentDidMount = useRef(false);

  const {
    jobs,
    pageable,
    loading: jobDataLoading,
  } = useTypedSelector((state) => state.jobListView);

  const {
    parameters: {
      parameters: { list: parametersList, pageable: parameterPageable },
    },
  } = useTypedSelector((state) => state.prototypeComposer);

  const {
    selectedFacility,
    selectedUseCase,
    roles: userRoles,
  } = useTypedSelector((state) => state.auth);

  const {
    checklists,
    pageable: checklistPageable,
    loading: checklistsLoading,
  } = useTypedSelector((state) => state.checklistListView);

  const { list: jobProperties, loading: jobPropertiesLoading } = useTypedSelector(
    (state) => state.properties[ComposerEntity.JOB],
  );

  const defaultFilters = useRef<FilterField[]>(getBaseFilter(values));

  const [filterFields, setFilterFields] = useState<FilterField[]>(getBaseFilter(values));

  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    dispatch(
      fetchJobs({
        page,
        size,
        sort: 'createdAt,desc',
        filters: JSON.stringify({
          op: FilterOperators.AND,
          fields: [
            ...filters,
            {
              field: 'useCaseId',
              op: FilterOperators.EQ,
              values: [selectedUseCase?.id],
            },
          ],
        }),
      }),
    );
  };

  useEffect(() => {
    if (componentDidMount.current) {
      const updatedBaseFilterValues = getBaseFilter(values);
      setFilterFields(getBaseFilter(values));
      fetchData({ filters: updatedBaseFilterValues });
    }
  }, [values]);

  useEffect(() => {
    fetchData({ filters: filterFields });
    fetchChecklistData({ page: 0 });
    componentDidMount.current = true;
  }, []);

  useEffect(() => {
    return () => {
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    };
  }, [label]);

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const selectedId = jobDetails.checklistId;
    if (selectedId) {
      dispatch(
        createJob({
          properties: jobDetails.properties,
          checklistId: selectedId,
          selectedUseCaseId: selectedUseCase!.id,
          relations: jobDetails?.relations,
        }),
      );
    }
  };

  const columns = [
    ...(values.some((val: JobStateType) => val in AssignedJobStates || val in CompletedJobStates)
      ? [
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
                      color: isJobCompleted ? '#5aa700' : isJobStarted ? '#1d84ff' : '#f7b500',
                    }}
                  />
                  <span title={title}>{title}</span>
                </div>
              );
            },
          },
        ]
      : []),
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
              navigate(`/jobs/${id}`, { state: { checklistId } });
            }}
            title={checklistName}
          >
            {checklistName}
          </span>
        );
      },
    },
    ...(values.some((val: JobStateType) => val in AssignedJobStates || val in CompletedJobStates)
      ? [
          {
            id: 'assignees',
            label: 'Assignees',
            minWidth: 152,
            format: function renderComp(item: Job) {
              return <AssigneesColumn assignees={item.assignees} />;
            },
          },
        ]
      : []),
    ...(values.some((val: JobStateType) => val in AssignedJobStates)
      ? [
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
        ]
      : []),
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

  const rows = jobs.map((item) => {
    return {
      ...item,
      parameterValues: keyBy(item.parameterValues, 'id'),
    };
  });

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
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    if (option?.id) {
      dispatch(
        fetchParameters(option.id, {
          page,
          size,
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: [
              {
                field: 'targetEntityType',
                op: FilterOperators.EQ,
                values: [TargetEntityType.PROCESS],
              },
              { field: 'archived', op: FilterOperators.EQ, values: [false] },
            ],
          }),
          sort: 'id,desc',
        }),
      );
    }
  };

  const updateFilterFields = (fields) => {
    setFilterFields((currentFields) => {
      const updatedFilterFields = [
        ...currentFields.filter((field) =>
          field.field === 'taskExecutions.assignees.user.id'
            ? true
            : defaultFilters.current.some((newField) => newField.field === field.field),
        ),
        ...fields,
      ];
      fetchData({
        filters: updatedFilterFields,
      });
      return updatedFilterFields;
    });
  };

  const onSelectUpdate = (option) => {
    if (option) {
      const selectedFilterField = [
        {
          field: 'checklist.id',
          op: FilterOperators.EQ,
          values: [option.id],
        },
      ];
      updateFilterFields(selectedFilterField);
      fetchParametersListData({ page: DEFAULT_PAGE_NUMBER, size: DEFAULT_PAGE_SIZE }, option);
    } else {
      updateFilterFields(filterFields.filter((curr) => curr.field !== 'checklist.id'));
      dispatch(fetchParametersSuccess({ data: [], pageable: { ...parameterPageable, page: 0 } }));
    }
  };

  const handleMenuScrollToBottom = () => {
    fetchChecklistData({ page: checklistPageable.page + 1 });
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
            ...jobProperties.map(({ label, id }) => ({
              label,
              value: id,
              field: 'jobPropertyValues.facilityUseCasePropertyMapping.propertiesId',
              operator: FilterOperators.EQ,
            })),
          ]}
          updateFilterFields={(fields) => {
            setFilterFields((currentFields) => {
              const updatedFilterFields = [
                ...currentFields.filter((field) =>
                  field.field === 'taskExecutions.assignees.user.id'
                    ? true
                    : defaultFilters.current.some((newField) => newField.field === field.field),
                ),
                ...fields,
              ];
              fetchData({
                filters: updatedFilterFields,
              });
              return updatedFilterFields;
            });
          }}
        />
        <Select
          className="process-filter"
          backspaceRemovesValue={false}
          hideSelectedOptions={false}
          onChange={(newValue) => {
            onSelectUpdate(newValue);
          }}
          isLoading={checklistsLoading}
          onInputChange={debounce((searchedValue: string) => {
            fetchChecklistData({ page: DEFAULT_PAGE_NUMBER, query: searchedValue });
          }, 500)}
          options={checklists.map((currList) => ({ ...currList, label: currList.name }))}
          placeholder="Processes"
          tabSelectsValue={false}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          optional
        />

        {label !== 'Unassigned' && (
          <UsersFilter
            options={assignedUsers}
            label="Assigned to"
            updateFilter={(fields) => {
              setAssignedUsers(fields);

              setFilterFields((currentFields) => {
                const filteredFields = currentFields.filter(
                  (field) => field.field !== 'taskExecutions.assignees.user.id',
                );

                const updatedFilterFields = [
                  ...filteredFields,
                  ...(fields.length > 0
                    ? ([
                        {
                          field: 'taskExecutions.assignees.user.id',
                          op: 'ANY',
                          values: fields.map((user) => user.id),
                        },
                      ] as FilterField[])
                    : []),
                ];
                fetchData({ filters: updatedFilterFields });
                return updatedFilterFields;
              });
            }}
          />
        )}

        {values[0] in CompletedJobStates && (
          <ToggleSwitch
            checkedIcon={false}
            onLabel="Jobs With Exception"
            offLabel="Jobs With Exception"
            value={
              !!(
                filterFields.find((field) => field.field === 'state')?.values[0] ===
                CompletedJobStates.COMPLETED_WITH_EXCEPTION
              )
            }
            onChange={(isChecked) => {
              setFilterFields((currentFields) => {
                const updatedFilterFields = [
                  ...currentFields.filter((el) => el.field !== 'state'),
                  ...(isChecked
                    ? ([
                        {
                          field: 'state',
                          op: FilterOperators.EQ,
                          values: [CompletedJobStates.COMPLETED_WITH_EXCEPTION],
                        },
                      ] as FilterField[])
                    : [...getBaseFilter(values)]),
                ];
                fetchData({ filters: updatedFilterFields });
                return updatedFilterFields;
              });
            }}
            uncheckedIcon={false}
          />
        )}

        {values[0] in UnassignedJobStates && checkPermission(['checklists', 'createJob']) && (
          <Button
            id="create"
            onClick={() => {
              if (
                userRoles?.some((role) => role === roles.ACCOUNT_OWNER) &&
                selectedFacility?.id === ALL_FACILITY_ID
              ) {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.ENTITY_START_ERROR_MODAL,
                    props: {
                      entity: ComposerEntity.JOB,
                    },
                  }),
                );
              } else {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.CREATE_JOB_MODAL,
                    props: {
                      selectedChecklist: null,
                      properties: parametersList || [],
                      onCreateJob: onCreateJob,
                    },
                  }),
                );
              }
            }}
          >
            Create a Job
          </Button>
        )}
      </div>

      <div
        style={{
          display: jobPropertiesLoading || jobDataLoading ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
      </div>

      <div
        style={{
          ...(jobPropertiesLoading || jobDataLoading
            ? { display: 'none' }
            : { display: 'contents' }),
        }}
      >
        <DataTable columns={columns} rows={rows} />
        <Pagination pageable={pageable} fetchData={fetchData} />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
