import {
  Button1,
  NewListView,
  ProgressBar,
  TabContentProps,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ComposerEntity } from '#Composer-new/types';
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
import { CompletedJobStates } from './types';
import {
  AssignedJobStates,
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

  const { list: jobProperties } = useProperties(ComposerEntity.JOB);

  const [filterFields, setFilterFields] = useState<FilterField[]>(
    getBaseFilter(values),
  );

  const fetchData = ({
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
  }: fetchDataArgs = {}) => {
    dispatch(
      fetchJobs({
        page,
        size,
        sort: 'createdAt,desc',
        filters: JSON.stringify({ op: 'AND', fields: filterFields }),
      }),
    );
  };

  useEffect(() => {
    setFilterFields(getBaseFilter(values));
  }, [label, values]);

  useEffect(() => {
    fetchData();
  }, [filterFields]);

  const showPaginationArrows = pageable.totalPages > 10;

  if (loading || !jobProperties.length) {
    return null;
  }

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
                    style={{
                      ...(values.some(
                        (val) =>
                          val in AssignedJobStates || val in CompletedJobStates,
                      )
                        ? {
                            width: '120px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                          }
                        : {}),
                    }}
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
                    const isJobStarted =
                      state === AssignedJobStates.IN_PROGRESS;

                    const isJobCompleted =
                      state === CompletedJobStates.COMPLETED;

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
                            ...(values.some(
                              (val) =>
                                val in AssignedJobStates ||
                                val in CompletedJobStates,
                            )
                              ? {
                                  width: '100px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: 'block',
                                }
                              : {}),
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
        {Array.from(
          { length: Math.min(pageable.totalPages, 10) },
          (_, i) => i,
        ).map((el) => (
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
