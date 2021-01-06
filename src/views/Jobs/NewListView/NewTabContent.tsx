import {
  Button1,
  NewListView,
  ProgressBar,
  SearchFilter,
  TabContentProps,
  ToggleSwitch,
  UsersFilter,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useProperties } from '#services/properties';
import { useTypedSelector } from '#store/helpers';
import { FilterField } from '#utils/globalTypes';
import { ArrowLeft, ArrowRight, FiberManualRecord } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createJob } from '../ListView/actions';
import { fetchJobs } from './actions';
import AssigneesColumn from './AssignessColumn';
import { TabContentWrapper } from './styles';
import {
  AssignedJobStates,
  CompletedJobStates,
  fetchDataArgs,
  Job,
  UnassignedJobStates,
} from './types';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBaseFilter = (values: string[]): FilterField[] => [
  { field: 'state', op: values.length === 1 ? 'EQ' : 'ANY', values },
];

const TabContent: FC<TabContentProps> = ({ label, values }) => {
  const dispatch = useDispatch();

  const { loading, jobs, pageable } = useTypedSelector(
    (state) => state.jobList,
  );

  const {
    isIdle,
    selectedFacility: { id: facilityId } = {},
  } = useTypedSelector((state) => state.auth);

  const { list: jobProperties } = useProperties(ComposerEntity.JOB);

  const [filterFields, setFilterFields] = useState<FilterField[]>(
    getBaseFilter(values),
  );

  const [assignedUsers, setAssignedUsers] = useState([]);

  const fetchData = ({
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
  }: fetchDataArgs = {}) => {
    dispatch(
      fetchJobs({
        facilityId,
        page,
        size,
        sort: 'createdAt,desc',
        filters: JSON.stringify({ op: 'AND', fields: filterFields }),
      }),
    );
  };

  useEffect(() => {
    setFilterFields(getBaseFilter(values));
  }, [values]);

  useEffect(() => {
    setFilterFields([
      ...getBaseFilter(values),
      {
        field: 'taskExecutions.assignees.user.id',
        op: 'ANY',
        values: assignedUsers.map((user) => user.id),
      },
    ]);
  }, [assignedUsers]);

  useEffect(() => {
    dispatch(
      fetchJobs({
        facilityId,
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        filters: JSON.stringify({ op: 'AND', fields: filterFields }),
      }),
    );
  }, [filterFields]);

  useEffect(() => {
    if (!isIdle) {
      fetchData();
    }
  }, [isIdle]);

  const showPaginationArrows = pageable.totalPages > 10;

  const onCreateJob = (jobDetails: Record<string, string>) => {
    const tempProperties: { id: number; value: string }[] = [];
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
      const parsedProperties: { id: number; value: string }[] = tempProperties;
      dispatch(
        createJob({
          properties: parsedProperties,
          checklistId: selectedId,
        }),
      );
    }
  };

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
            ...jobProperties.map(({ placeHolder, name }) => ({
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
            console.log('fields :: ', _fields);
          }}
        />

        {label !== 'Unassigned' && (
          <UsersFilter
            options={assignedUsers}
            label="Assigned to"
            updateFilter={(fields) => {
              console.log('Updated Filter', fields);
              setAssignedUsers(fields);
            }}
          />
        )}

        {values[0] in CompletedJobStates ? (
          <ToggleSwitch
            checkedIcon={false}
            value={false}
            onLabel="Jobs With Exception"
            offLabel="Jobs With Exception"
            onChange={(isChecked) => {
              setFilterFields((currentFields) => [
                ...currentFields.filter((el) => el.field !== 'state'),
                ...(isChecked
                  ? [
                      {
                        field: 'state',
                        op: 'EQ',
                        values: [CompletedJobStates.COMPLETED_WITH_EXCEPTION],
                      },
                    ]
                  : [...getBaseFilter(values)]),
              ]);
              console.log('isCHecked :: ', isChecked);
            }}
            uncheckedIcon={false}
          />
        ) : null}

        {values[0] in UnassignedJobStates ? (
          <Button1
            id="create-job"
            onClick={() =>
              dispatch(
                openOverlayAction({
                  type: OverlayNames.CREATE_JOB_MODAL,
                  props: {
                    selectedChecklist: null,
                    properties: jobProperties,
                    onCreateJob: onCreateJob,
                  },
                }),
              )
            }
          >
            Create a Job
          </Button1>
        ) : null}
      </div>

      <NewListView
        properties={jobProperties}
        data={jobs}
        beforeColumns={[
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
                      navigate(`/jobs/${id}`, { state: { checklistId } });
                    }}
                    // style={{
                    //   ...(values.some(
                    //     (val) =>
                    //       val in AssignedJobStates || val in CompletedJobStates,
                    //   )
                    //     ? {
                    //         width: '120px',
                    //         whiteSpace: 'nowrap',
                    //         overflow: 'hidden',
                    //         textOverflow: 'ellipsis',
                    //         display: 'block',
                    //       }
                    //     : {}),
                    // }}
                  >
                    {checklistName}
                  </span>
                </div>
              );
            },
          },
          ...(values.some(
            (val) => val in AssignedJobStates || val in CompletedJobStates,
          )
            ? [
                {
                  header: 'Job Status',
                  template: function renderComp({ state }: Job) {
                    const isJobBlocked = state === AssignedJobStates.BLOCKED;

                    const isJobStarted =
                      state === AssignedJobStates.IN_PROGRESS;

                    const isJobCompleted =
                      state === CompletedJobStates.COMPLETED;

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
                            ...(values.some(
                              (val) =>
                                val in AssignedJobStates ||
                                val in CompletedJobStates,
                            )
                              ? {
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  fontSize: '12px',
                                  lineHeight: '20px',
                                }
                              : {}),
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
                    return <AssigneesColumn jobId={item.id} />;
                  },
                },
                {
                  header: 'Task Completed',
                  template: function renderComp({
                    completedTasks,
                    totalTasks,
                  }: Job) {
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
              ]
            : []),
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
        ]}
      />
      <div className="pagination">
        <ArrowLeft
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page > 0) {
              fetchData({ page: pageable.page - 1, size: DEFAULT_PAGE_SIZE });
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
              onClick={() => fetchData({ page: el, size: DEFAULT_PAGE_SIZE })}
            >
              {el + 1}
            </span>
          ))}
        <ArrowRight
          className={`icon ${showPaginationArrows ? '' : 'hide'}`}
          onClick={() => {
            if (pageable.page < pageable.totalPages - 1) {
              fetchData({ page: pageable.page + 1, size: DEFAULT_PAGE_SIZE });
            }
          }}
        />
      </div>
    </TabContentWrapper>
  );
};

export default TabContent;
