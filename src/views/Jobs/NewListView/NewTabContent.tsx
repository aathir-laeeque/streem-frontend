import {
  Button1,
  DataTable,
  ProgressBar,
  SearchFilter,
  TabContentProps,
  ToggleSwitch,
  UsersFilter,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { roles } from '#services/uiPermissions';
import { useTypedSelector } from '#store/helpers';
import { User } from '#store/users/types';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { CircularProgress } from '@material-ui/core';
import { ArrowLeft, ArrowRight, FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createJob, fetchJobs } from './actions';
import AssigneesColumn from './AssignessColumn';
import { TabContentWrapper } from './styles';
import {
  AssignedJobStates,
  CompletedJobStates,
  Job,
  JobStateType,
  UnassignedJobStates,
} from './types';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

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
    selectedFacility,
    selectedUseCase,
    roles: userRoles,
  } = useTypedSelector((state) => state.auth);

  const { list: jobProperties, loading: jobPropertiesLoading } = useTypedSelector(
    (state) => state.properties[ComposerEntity.JOB],
  );

  const defaultFilters = useRef<FilterField[]>(getBaseFilter(values));

  const [filterFields, setFilterFields] = useState<FilterField[]>(getBaseFilter(values));

  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const fetchData = (
    filtersArr: FilterField[],
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
  ) => {
    dispatch(
      fetchJobs({
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
      }),
    );
  };

  useEffect(() => {
    if (componentDidMount.current) {
      const updatedBaseFilterValues = getBaseFilter(values);
      setFilterFields(getBaseFilter(values));
      fetchData(updatedBaseFilterValues);
    }
  }, [values]);

  useEffect(() => {
    fetchData(filterFields);
    componentDidMount.current = true;
  }, []);

  const showPaginationArrows = pageable.totalPages > 10;

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: string; value: string }[] = [];
    const selectedId = jobDetails.checklistId;
    let error = false;
    if (!jobProperties) return false;
    jobProperties.every((property) => {
      if (property.name) {
        if (!jobDetails[property.name]) {
          if (property.mandatory) {
            error = true;
            return false;
          }
          return true;
        } else {
          tempProperties.push({
            id: property.id,
            value: jobDetails[property.name],
          });
          return true;
        }
      }
    });
    if (!error && tempProperties && selectedId) {
      const parsedProperties: { id: string; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
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
    ...jobProperties.map((jobProperty) => {
      return {
        id: jobProperty.id,
        label: jobProperty.label,
        minWidth: 125,
        maxWidth: 180,
      };
    }),
    ...(jobs?.[0]?.relations || []).map((relation) => {
      return {
        id: relation.id,
        label: relation.displayName,
        minWidth: 125,
        maxWidth: 180,
      };
    }),
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
            setFilterFields((currentFields) => {
              const updatedFilterFields = [
                ...currentFields.filter((field) =>
                  field.field === 'taskExecutions.assignees.user.id'
                    ? true
                    : defaultFilters.current.some((newField) => newField.field === field.field),
                ),
                ...fields,
              ];
              fetchData(updatedFilterFields);
              return updatedFilterFields;
            });
          }}
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
                fetchData(updatedFilterFields);
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
                fetchData(updatedFilterFields);
                return updatedFilterFields;
              });
            }}
            uncheckedIcon={false}
          />
        )}

        {values[0] in UnassignedJobStates && (
          <Button1
            id="create"
            onClick={() => {
              if (
                userRoles?.some((role) => role === roles.ACCOUNT_OWNER) &&
                selectedFacility?.id === '-1'
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
                      properties: jobProperties,
                      onCreateJob: onCreateJob,
                    },
                  }),
                );
              }
            }}
          >
            Create a Job
          </Button1>
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
        <DataTable
          columns={columns}
          rows={jobs.map((item) => {
            return {
              ...item,
              ...item.properties!.reduce<Record<string, string>>((acc, itemProperty) => {
                acc[itemProperty.id] = itemProperty.value;
                return acc;
              }, {}),
              ...item.relations!.reduce<Record<string, string>>((acc, relation) => {
                acc[relation.id] = relation.targets
                  .map((target) => `${target.displayName} - ${target.externalId}`)
                  .join('\n');
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
