import { LabelValueRow } from '#JobComposer/Header/styles';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import {
  Button,
  CardWithTitle,
  LoadingContainer,
  PaginatedFetchData,
  Pagination,
  StyledTabs,
} from '#components';
import { useTypedSelector } from '#store';
import { apiGetJobsByResource } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGINATION } from '#utils/constants';
import { FilterOperators, InputTypes } from '#utils/globalTypes';
import { getParameterContent } from '#utils/parameterUtils';
import { request } from '#utils/request';
import { formatDateByInputType, formatDateTime } from '#utils/timeUtils';
import JobInfoDrawer from '#views/Jobs/Components/JobInfo';
import {
  AssignedJobStates,
  CompletedJobStates,
  UnassignedJobStates,
} from '#views/Jobs/ListView/types';
import { ArrowForward, ChevronLeft } from '@material-ui/icons';
import { RouteComponentProps, navigate } from '@reach/router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchObject, fetchObjectType, resetOntology } from '../actions';
import { Choice, ObjectTypeProperty } from '../types';
import AddEditObjectDrawer from './components/AddEditObjectDrawer';
import ProcessTabContent from './components/ProcessTabContent';
import RelationTabContent from './components/RelationTabContent';

const ObjectViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  .object-header {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    .object-header-section {
      display: flex;
      &.left {
        flex-direction: column;
        gap: 4px;
        .meta-info {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        h4 {
          font-weight: 700;
          font-size: 16px;
          line-height: 20px;
          color: #161616;
          margin: 0;
        }
        span {
          font-weight: 400;
          font-size: 12px;
          line-height: 12px;
          text-align: center;
          letter-spacing: 0.32px;
          color: #525252;
        }
        .badge {
          padding: 4px 8px;
          background: #d0e2ff;
          color: #0043ce;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
        }
      }
      &.right {
      }
    }
  }

  .object-tabs {
    display: flex;
    overflow: hidden;

    .object-tabs-list {
      padding: 16px;
      background-color: #fff;
      min-width: 200px;
      border-right: 1px solid #e0e0e0;
    }

    .MuiTabs-flexContainer {
      border-bottom: none;
      button {
        border-bottom: 1px solid #e0e0e0;
        :last-of-type {
          border-bottom: none;
        }

        &.Mui-selected {
          background: #e7f1fd;
          .MuiTab-wrapper {
            font-weight: 400;
          }
        }
      }
    }

    .MuiTabs-indicator {
      left: 0;
      right: unset;
    }
  }

  .object-tabs-panel {
    padding: 16px;
    overflow: auto;
  }

  .job-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 16px 16px 0;
    gap: 16px;
    .job-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      border: 1px solid #e0e0e0;
      .job-row-section {
        display: flex;
        &.left {
          flex: 1;
          flex-direction: column;
          gap: 8px;
          padding: 16px 16px 8px 16px;
          .job-row-section-left {
            display: flex;
            &.top {
              .job-name {
                margin: 0;
                font-weight: 400;
                font-size: 14px;
                line-height: 16px;
                letter-spacing: 0.16px;
                color: #1d84ff;
                cursor: pointer;
              }
              .schedule-info {
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 8px;
                span {
                  font-weight: 400;
                  font-size: 12px;
                  line-height: 12px;
                  letter-spacing: 0.32px;
                  color: #161616;
                }
                .icon {
                  padding: 2px;
                  background: #e0e0e0;
                  border-radius: 50%;

                  svg {
                    font-size: 12px;
                  }
                }
              }
            }
          }
        }
        &.right {
          width: 36px;
          height: 100px;
          background-color: #f4f4f4;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }

  .MuiTableRow-root {
    background-color: #fff !important;
  }
`;

const OverViewTabContent = () => {
  const {
    auth: { selectedUseCase },
    ontology: {
      objects: { active: selectedObject },
      objectTypes: { active: selectedObjectType },
    },
  } = useTypedSelector((state) => state);

  const [state, setState] = useState<Record<string, any>>({
    onGoing: {
      label: 'Ongoing Jobs',
      list: [],
      pageable: { ...DEFAULT_PAGINATION, pageSize: 7 },
      filters: [
        {
          field: 'state',
          op: FilterOperators.ANY,
          values: [AssignedJobStates.IN_PROGRESS, AssignedJobStates.BLOCKED],
        },
      ],
    },
    dueToday: {
      label: 'Due Today',
      list: [],
      pageable: { ...DEFAULT_PAGINATION, pageSize: 3 },
      filters: [
        {
          field: 'state',
          op: FilterOperators.ANY,
          values: [
            AssignedJobStates.IN_PROGRESS,
            AssignedJobStates.BLOCKED,
            AssignedJobStates.ASSIGNED,
            UnassignedJobStates.UNASSIGNED,
          ],
        },
        {
          field: 'expectedEndDate',
          op: FilterOperators.LT,
          values: [moment().endOf('day').unix().toString()],
        },
      ],
    },
    recentlyCompleted: {
      label: 'Recently Completed',
      list: [],
      pageable: DEFAULT_PAGINATION,
      filters: [
        {
          field: 'state',
          op: FilterOperators.ANY,
          values: [CompletedJobStates.COMPLETED, CompletedJobStates.COMPLETED_WITH_EXCEPTION],
        },
      ],
    },
  });

  const [selectedJob, setSelectedJob] = useState<any>();

  const objectPropertiesMapByExternalId = selectedObject?.properties?.reduce<
    Record<string, string | Choice[] | undefined>
  >((acc, property) => {
    acc[property.externalId] = property.choices?.length ? property.choices : property.value;
    return acc;
  }, {});

  const propertyToValue = (property: ObjectTypeProperty) => {
    let propertyValue = objectPropertiesMapByExternalId?.[property.externalId];
    if (propertyValue) {
      if (Array.isArray(propertyValue)) {
        propertyValue = propertyValue.map((option) => option.displayName).join(', ');
      } else {
        if ([InputTypes.DATE, InputTypes.TIME, InputTypes.DATE_TIME].includes(property.inputType)) {
          propertyValue = formatDateByInputType(property.inputType, propertyValue);
        }
      }
    } else {
      propertyValue = '-';
    }
    return propertyValue;
  };

  const fetchData = async (type: string, params: PaginatedFetchData = {}) => {
    const {
      page = DEFAULT_PAGE_NUMBER,
      size = state[type].pageable.pageSize,
      filters = state[type].filters,
    } = params;
    try {
      const { data, pageable } = await request('GET', apiGetJobsByResource(selectedObject!.id), {
        params: {
          page,
          size,
          sort: 'createdAt,desc',
          filters: {
            op: FilterOperators.AND,
            fields: [
              {
                field: 'useCaseId',
                op: FilterOperators.EQ,
                values: [selectedUseCase?.id],
              },
              ...filters,
            ],
          },
        },
      });

      if (data) {
        setState((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            list: data,
            pageable,
          },
        }));
      }
    } catch (error) {
      console.error('error from fetchJobs in object view :: ', error);
    }
  };

  useEffect(() => {
    if (selectedObject) {
      Object.keys(state).forEach((type) => {
        fetchData(type);
      });
    }
  }, []);

  return (
    <div className="overview-tab">
      <CardWithTitle>
        <LabelValueRow style={{ padding: '8px 16px' }}>
          {[...(selectedObjectType?.properties || [])]
            .filter(({ externalId }) => !['displayName', 'externalId'].includes(externalId))
            .slice(0, 5)
            .map((property) => (
              <div className="info-item" key={property.displayName}>
                <label className="info-item-label">{property.displayName}</label>
                <span className="info-item-value">{propertyToValue(property)}</span>
              </div>
            ))}
        </LabelValueRow>
      </CardWithTitle>
      {Object.entries(state).map(([type, values]: any) => {
        return (
          <CardWithTitle>
            <h4 className="card-label">{values.label}</h4>
            <div className="job-list">
              {values.list.map((job) => {
                return (
                  <div className="job-row" key={job.id}>
                    <div className="job-row-section left">
                      <div className="job-row-section-left top">
                        <h5 className="job-name" onClick={() => navigate(`/inbox/${job.id}`)}>
                          {job.checklist.name}
                        </h5>
                        {job.expectedStartDate && job.expectedEndDate && (
                          <div className="schedule-info">
                            <span>{formatDateTime(job.expectedStartDate)}</span>
                            <span className="icon">
                              <ArrowForward />
                            </span>
                            <span>{formatDateTime(job.expectedEndDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="job-row-section-left bottom">
                        <LabelValueRow>
                          {(job?.parameterValues || [])
                            .filter((p) => p.targetEntityType === TargetEntityType.PROCESS)
                            .slice(0, 5)
                            .map((parameter) => (
                              <div className="info-item" key={parameter.label}>
                                <label className="info-item-label">{parameter.label}</label>
                                <span className="info-item-value">
                                  {getParameterContent(parameter)}
                                </span>
                              </div>
                            ))}
                        </LabelValueRow>
                      </div>
                    </div>
                    <div
                      className="job-row-section right"
                      onClick={() => {
                        setSelectedJob(job);
                      }}
                    >
                      <ChevronLeft />
                    </div>
                  </div>
                );
              })}
              <Pagination
                pageable={values.pageable}
                fetchData={(pagination) => {
                  fetchData(type, pagination);
                }}
              />
            </div>
          </CardWithTitle>
        );
      })}

      {selectedJob && <JobInfoDrawer job={selectedJob} onCloseDrawer={setSelectedJob} />}
    </div>
  );
};

const ObjectsContent = ({
  id,
  objectTypeId,
}: RouteComponentProps<{ id: string; objectTypeId: string }>) => {
  const dispatch = useDispatch();
  const [showAddEditObjectDrawer, setShowAddEditObjectDrawer] = useState(false);
  const {
    objects: { active: selectedObject, activeLoading: loadingObject },
    objectTypes: { active: selectedObjectType },
  } = useTypedSelector((state) => state.ontology);

  useEffect(() => {
    if (objectTypeId && !selectedObjectType) {
      dispatch(fetchObjectType(objectTypeId));
    }

    return () => {
      dispatch(resetOntology(['objects', 'activeLoading']));
    };
  }, []);

  useEffect(() => {
    if (selectedObjectType && selectedObjectType.externalId && id) {
      dispatch(fetchObject(id, { collection: selectedObjectType.externalId }));
    }
  }, [selectedObjectType]);

  return (
    <LoadingContainer
      loading={loadingObject}
      component={
        <ObjectViewWrapper>
          <div className="object-header">
            <div className="object-header-section left">
              <h4>{selectedObject?.displayName}</h4>
              <div className="meta-info">
                <div className="badge">
                  {selectedObject?.usageStatus === 1 ? 'Active' : 'Inactive'}
                </div>
                <span>ID: {selectedObject?.externalId}</span>
                {selectedObject?.createdAt && (
                  <span>Created Date: {formatDateTime(selectedObject!.createdAt)}</span>
                )}
              </div>
            </div>
            <div className="object-header-section right">
              <Button variant="secondary" onClick={() => setShowAddEditObjectDrawer(true)}>
                View Properties
              </Button>
            </div>
          </div>
          <StyledTabs
            containerProps={{
              className: 'object-tabs',
            }}
            tabListProps={{
              className: 'object-tabs-list',
              orientation: 'vertical',
            }}
            panelsProps={{
              className: 'object-tabs-panel',
            }}
            tabs={[
              {
                value: '0',
                label: 'Overview',
                panelContent: <OverViewTabContent />,
              },
              {
                value: '1',
                label: 'Relations',
                panelContent: <RelationTabContent />,
              },
              {
                value: '2',
                label: 'Process',
                panelContent: <ProcessTabContent />,
              },
            ]}
          />
          {selectedObject && selectedObjectType && showAddEditObjectDrawer && (
            <AddEditObjectDrawer
              onCloseDrawer={setShowAddEditObjectDrawer}
              values={{
                objectTypeId: selectedObjectType.id,
                id: selectedObject.id,
              }}
            />
          )}
        </ObjectViewWrapper>
      }
    />
  );
};

export default ObjectsContent;
