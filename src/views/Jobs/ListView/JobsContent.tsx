import { LabelValueRow } from '#JobComposer/Header/styles';
import { Checklist, MandatoryParameter } from '#JobComposer/checklist.types';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import {
  Button,
  LoadingContainer,
  PaginatedFetchData,
  Pagination,
  ProgressBar,
  SearchFilter,
  Select,
  TabContentProps,
  fetchDataParams,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import checkPermission from '#services/uiPermissions';
import { useTypedSelector } from '#store/helpers';
import { apiJobsCount } from '#utils/apiUrls';
import { ALL_FACILITY_ID, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { request } from '#utils/request';
import {
  formatDateTime,
  formatDateTimeToHumanReadable,
  getDelayBetweenEpoch,
  getOverDueByEpoch,
} from '#utils/timeUtils';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import { ArrowForward, ChevronLeft, FiberManualRecord } from '@material-ui/icons';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import RepeatIcon from '@material-ui/icons/Repeat';
import { navigate } from '@reach/router';
import { capitalize, debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RRule } from 'rrule';
import styled from 'styled-components';
import CreateJob from '../Components/CreateJob';
import JobInfoDrawer from '../Components/JobInfo';
import { fetchJobs } from './actions';
import { TabContentWrapper } from './styles';
import { AssignedJobStates, CompletedJobStates, Job } from './types';

const CountCardWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  gap: 16px;

  .count-card {
    cursor: pointer;
    display: flex;
    line-height: 1.14;
    letter-spacing: 0.16px;
    color: #000000;
    position: relative;
    font-size: 12px;
    &.grey {
      border: 1px solid #e8e8e8;
    }
    &.blue {
      border: 1px solid #d2e6ff;
    }
    &.orange {
      border: 1px solid #fce6d1;
    }
    &.yellow {
      border: 1px solid #fcf3d1;
    }

    .count-card-label {
      padding: 8px 16px;
      &.grey {
        background: #f6f6f6;
      }
      &.blue {
        background: #f3f8ff;
      }
      &.orange {
        background: #fff8f1;
      }
      &.yellow {
        background: #fffcf2;
      }
    }

    .count-card-value {
      padding: 8px 16px;
      &.grey {
        background: #e8e8e8;
      }
      &.blue {
        background: #d2e6ff;
      }
      &.orange {
        background: #fce6d1;
      }
      &.yellow {
        background: #fcf3d1;
      }
    }
  }
`;

type CountCardsType = {
  items: ({
    label: string;
    value: string | number;
    type?: 'grey' | 'blue' | 'orange' | 'yellow';
  } & Record<string, any>)[];
  onChange?: (value: React.SetStateAction<FilterField[]>) => void;
};

export const CountCards: FC<CountCardsType> = ({ items, onChange }) => {
  const onClick = (cardFilters: Array<FilterField>) => {
    if (onChange) {
      onChange((currentFields) => {
        const updatedFilterFields = [
          ...currentFields.filter(
            (field) => !(cardFilters || []).some((cF) => cF.field === field.field),
          ),
          ...cardFilters,
        ];
        return updatedFilterFields;
      });
    }
  };
  return (
    <CountCardWrapper>
      {items.map((item) => (
        <div className={`count-card ${item.type || 'grey'}`} onClick={() => onClick(item.filters)}>
          <div className={`count-card-label ${item.type || 'grey'}`}>{item.label}</div>
          <div className={`count-card-value ${item.type || 'grey'}`}>{item.value}</div>
        </div>
      ))}
    </CountCardWrapper>
  );
};

export const ProcessNameColumnFormat = (job: Job, setSelectedJob: any, inInboxView: boolean) => {
  const {
    id,
    checklist: { id: checklistId, name: checklistName },
    jobScheduler,
  } = job;
  let navigateTo = '/jobs';
  if (inInboxView) {
    navigateTo = '/inbox';
  }
  return (
    <div className="flex-column">
      <div>
        <span
          title={checklistName}
          className="primary"
          onClick={() => {
            navigate(`${navigateTo}/${id}`, { state: { checklistId } });
          }}
        >
          {checklistName}
        </span>
        {jobScheduler?.recurrenceRule && (
          <div className="description">
            {capitalize(RRule.fromString(jobScheduler.recurrenceRule)?.toText()).split(' on')[0]}
            <RepeatIcon />
          </div>
        )}
      </div>
      <div className="description" title="Info">
        <InfoOutlinedIcon
          style={{ fontSize: 16, color: '#161616', cursor: 'pointer' }}
          onClick={() => setSelectedJob(job)}
        />
      </div>
    </div>
  );
};

export const DateOverdueFormat = ({ id, epoch, className, onSetDate, inInboxView }: any) => {
  const handleOnClickSetDate = () => {
    onSetDate?.(id);
  };
  return (
    <>
      {epoch ? (
        <div>
          <span>{formatDateTimeToHumanReadable(epoch)}</span>
          <div className={`overdue ${className}`}>{getOverDueByEpoch(epoch)}</div>
        </div>
      ) : inInboxView ? (
        '-'
      ) : (
        <span className="primary" onClick={() => handleOnClickSetDate()}>
          Set Date
        </span>
      )}
    </>
  );
};

export const DateDelayFormat = ({
  id,
  actual,
  expected,
  className,
  onSetDate,
  inInboxView,
}: any) => {
  const handleOnClickSetDate = () => {
    onSetDate?.(id);
  };
  return (
    <>
      {actual ? (
        <div>
          <div>{formatDateTimeToHumanReadable(actual)}</div>
          {expected && (
            <div className={`overdue ${className}`}>{getDelayBetweenEpoch(expected, actual)}</div>
          )}
        </div>
      ) : inInboxView ? (
        '-'
      ) : (
        <span className="primary" onClick={() => handleOnClickSetDate()}>
          Set Date
        </span>
      )}
    </>
  );
};

export const getJobsColumnByTab = (label: string, setSelectedJob: any, onSetDate?: any) => {
  let inInboxView = location.pathname.split('/')?.[1] === 'inbox';
  if (label === 'Created' || label === 'Not Started') {
    return [
      {
        id: 'name',
        label: 'Process',
        minWidth: 200,
        format: (job: Job) => ProcessNameColumnFormat(job, setSelectedJob, inInboxView),
      },
      {
        id: 'startDate',
        label: 'Start Date',
        minWidth: 152,
        format: ({ id, expectedStartDate }: Job) =>
          DateOverdueFormat({
            id,
            epoch: expectedStartDate,
            className: 'orange',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        minWidth: 152,
        format: ({ id, expectedEndDate }: Job) =>
          DateOverdueFormat({
            id,
            epoch: expectedEndDate,
            className: 'red',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'code',
        label: 'Job ID',
        minWidth: 152,
      },
    ];
  } else if (label === 'On Going') {
    return [
      {
        id: 'name',
        label: 'Process',
        minWidth: 200,
        format: (job: Job) => ProcessNameColumnFormat(job, setSelectedJob, inInboxView),
      },
      {
        id: 'startDate',
        label: 'Started At',
        minWidth: 152,
        format: ({ id, expectedStartDate, startedAt }: Job) =>
          DateDelayFormat({
            id,
            expected: expectedStartDate,
            actual: startedAt,
            className: 'orange',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'dueDate',
        label: 'Due Date',
        minWidth: 152,
        format: ({ id, expectedEndDate }: Job) =>
          DateOverdueFormat({
            id,
            epoch: expectedEndDate,
            className: 'red',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'task-completed',
        label: 'Progress',
        minWidth: 152,
        format: function renderComp({ completedTasks = 0, totalTasks = 0 }: Job) {
          const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div className="task-progress">
              <ProgressBar percentage={percentage} />
            </div>
          );
        },
      },
      {
        id: 'code',
        label: 'Job ID',
        minWidth: 152,
      },
    ];
  } else if (label === 'Completed') {
    return [
      {
        id: 'name',
        label: 'Process',
        minWidth: 200,
        format: (job: Job) => ProcessNameColumnFormat(job, setSelectedJob, inInboxView),
      },
      {
        id: 'state',
        label: 'Status',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiberManualRecord
                className="icon"
                style={{
                  fontSize: '12px',
                  color: isJobCompleted ? '#5aa700' : isJobStarted ? '#1d84ff' : '#f7b500',
                }}
              />
              <span title={title}>{title}</span>
            </div>
          );
        },
      },
      {
        id: 'startDate',
        label: 'Started At',
        minWidth: 152,
        format: ({ id, expectedStartDate, startedAt }: Job) =>
          DateDelayFormat({
            id,
            expected: expectedStartDate,
            actual: startedAt,
            className: 'orange',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'startDate',
        label: 'Completed On',
        minWidth: 152,
        format: ({ id, endedAt }: Job) =>
          DateDelayFormat({
            id,
            actual: endedAt,
            className: 'orange',
            inInboxView,
            onSetDate,
          }),
      },
      {
        id: 'code',
        label: 'Job ID',
        minWidth: 152,
      },
    ];
  }
  return [];
};

const JobsContent: FC<TabContentProps> = ({
  label,
  values: { baseFilters, cards, processFilter },
}) => {
  const dispatch = useDispatch();
  const {
    jobListView: { jobs, pageable, loading, reRender },
    auth: { selectedFacility, selectedUseCase },
    checklistListView: { checklists, pageable: checklistPageable, loading: checklistsLoading },
  } = useTypedSelector((state) => state);
  const [createJobDrawerVisible, setCreateJobDrawerVisible] = useState(false);
  const [filterFields, setFilterFields] = useState<FilterField[]>([
    ...(baseFilters || []),
    {
      field: 'useCaseId',
      op: FilterOperators.EQ,
      values: [selectedUseCase?.id],
    },
  ]);
  const [cardsValues, setCardsValues] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>();

  const fetchCardsValues = async () => {
    const cardsResponse = await Promise.all(
      cards.map((card: any) => {
        return request('GET', apiJobsCount(), {
          params: {
            filters: {
              op: FilterOperators.AND,
              fields: [
                ...filterFields.filter(
                  (field) =>
                    !(card.filters || []).some((cF: FilterField) => cF.field === field.field),
                ),
                ...card.filters,
              ],
            },
          },
        });
      }),
    );

    let _cardsValues: any[] = [];

    cards.forEach((card: any, index: number) => {
      if (cardsResponse?.[index]?.pageable?.totalElements) {
        _cardsValues.push({
          ...card,
          value: cardsResponse?.[index]?.pageable?.totalElements,
          type: card.className,
        });
      }
    });

    setCardsValues(_cardsValues);
  };

  useEffect(() => {
    fetchChecklistData({ page: 0 });
  }, []);

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

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    dispatch(
      fetchJobs({
        page,
        size,
        sort: 'createdAt,desc',
        filters: {
          op: FilterOperators.AND,
          fields: [...filters],
        },
      }),
    );
  };

  useEffect(() => {
    fetchData({ filters: filterFields });
    if (cards?.length) fetchCardsValues();
  }, [filterFields, reRender]);

  const handleOnCreateJob = () => {
    if (selectedFacility?.id === ALL_FACILITY_ID) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.ENTITY_START_ERROR_MODAL,
          props: {
            entity: ComposerEntity.JOB,
          },
        }),
      );
    } else {
      setCreateJobDrawerVisible(true);
    }
  };

  const onSelectUpdate = (option: Checklist) => {
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
    } else {
      setFilterFields((currentFields) =>
        currentFields.filter((curr) => curr.field !== 'checklist.id'),
      );
    }
  };

  const onSetDate = (jobId: string) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.SET_DATE,
        props: {
          jobId,
        },
      }),
    );
  };

  const handleMenuScrollToBottom = () => {
    if (!checklistPageable.last) fetchChecklistData({ page: checklistPageable.page + 1 });
  };

  const content = (parameter: any) => {
    let contentString;

    switch (parameter.type) {
      case MandatoryParameter.SHOULD_BE:
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.NUMBER:
      case MandatoryParameter.DATE:
      case MandatoryParameter.DATE_TIME:
        contentString = parameter.response.value;
        break;
      case MandatoryParameter.YES_NO:
        contentString = contentDetails(parameter);
        break;
      case MandatoryParameter.SINGLE_SELECT:
        contentString = contentDetails(parameter);
        break;
      case MandatoryParameter.RESOURCE:
        contentString = parameter.response.choices.reduce(
          (acc: any, currChoice: any) =>
            (acc = `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId})`),
          '',
        );
        break;
      case MandatoryParameter.MULTISELECT:
        contentString = contentDetails(parameter);
        break;
      default:
        return;
    }

    return contentString;
  };

  const contentDetails = ({ data, response }: any) => {
    let detailList: any[] = [];
    data.forEach((currData: any) => {
      if (response.choices[currData.id] === 'SELECTED') {
        return detailList.push(`${currData.name}${response.reason ? ` :${response.reason}` : ''}`);
      }
    });
    return detailList.join(', ');
  };

  return (
    <TabContentWrapper>
      {cardsValues.length > 0 && <CountCards items={cardsValues} onChange={setFilterFields} />}
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
            onSelectUpdate(newValue);
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
          isDisabled={!!processFilter}
          {...(processFilter && {
            defaultValue: [{ label: processFilter.processName, value: processFilter.id }],
          })}
        />
        {processFilter?.schedulerId && (
          <Select
            className="process-filter"
            isDisabled={!!processFilter?.schedulerId}
            {...(processFilter && {
              defaultValue: [
                { label: processFilter.schedulerName, value: processFilter.schedulerId },
              ],
            })}
          />
        )}
        {!processFilter &&
          !(baseFilters[0] in CompletedJobStates) &&
          checkPermission(['checklists', 'createJob']) && (
            <Button id="create" onClick={handleOnCreateJob}>
              Create a Job
            </Button>
          )}
      </div>
      <LoadingContainer
        loading={loading}
        component={
          <>
            <div className="job-list">
              {jobs.map((job) => (
                <div className="job-row" key={job.id}>
                  <div className="job-row-section left">
                    <div className="job-row-section-left top">
                      <h5 className="job-name" onClick={() => navigate(`/jobs/${job.id}`)}>
                        {job.checklist.name}
                      </h5>
                      {job.expectedStartDate && job.expectedEndDate ? (
                        <div className="schedule-info">
                          <span>{formatDateTime(job.expectedStartDate)}</span>
                          <span className="icon">
                            <ArrowForward />
                          </span>
                          <span>{formatDateTime(job.expectedEndDate)}</span>
                        </div>
                      ) : (
                        <div className="schedule-info">
                          <span className="primary" onClick={() => onSetDate(job.id)}>
                            Set Date
                          </span>
                          <span className="icon">
                            <ArrowForward />
                          </span>
                          <span className="primary" onClick={() => onSetDate(job.id)}>
                            Set Date
                          </span>
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
                              <span className="info-item-value">{content(parameter)}</span>
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
                    style={{
                      height: (job?.parameterValues || []).filter(
                        (p) => p.targetEntityType === TargetEntityType.PROCESS,
                      ).length
                        ? 100
                        : 50,
                    }}
                  >
                    <ChevronLeft />
                  </div>
                </div>
              ))}
            </div>
            <Pagination pageable={pageable} fetchData={fetchData} />
          </>
        }
      />
      {createJobDrawerVisible && <CreateJob onCloseDrawer={setCreateJobDrawerVisible} />}
      {selectedJob && <JobInfoDrawer job={selectedJob} onCloseDrawer={setSelectedJob} />}
    </TabContentWrapper>
  );
};

export default JobsContent;
