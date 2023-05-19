import { LabelValueRow } from '#JobComposer/Header/styles';
import { Checklist } from '#JobComposer/checklist.types';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import {
  LoadingContainer,
  PaginatedFetchData,
  Pagination,
  SearchFilter,
  Select,
  TabContentProps,
  fetchDataParams,
} from '#components';
import { useTypedSelector } from '#store/helpers';
import { apiInboxJobsCount } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { getParameterContent } from '#utils/parameterUtils';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import JobInfoDrawer from '#views/Jobs/Components/JobInfo';
import { CountCards } from '#views/Jobs/ListView/JobsContent';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { ArrowForward, ChevronLeft } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInbox } from './actions';

const InboxContent: FC<TabContentProps> = ({
  label,
  values: { baseFilters, cards, processFilter },
}) => {
  const dispatch = useDispatch();
  const {
    inboxListView: { jobs, pageable, loading },
    auth: { selectedFacility: { id: facilityId = '' } = {}, selectedUseCase },
    checklistListView: { checklists, pageable: checklistPageable, loading: checklistsLoading },
  } = useTypedSelector((state) => state);
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
        return request('GET', apiInboxJobsCount(), {
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
      if (cardsResponse?.[index]?.data?.count) {
        _cardsValues.push({
          ...card,
          value: cardsResponse?.[index]?.data?.count,
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
      fetchInbox({
        facilityId,
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
  }, [filterFields]);

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

  const handleMenuScrollToBottom = () => {
    if (!checklistPageable.last) fetchChecklistData({ page: checklistPageable.page + 1 });
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
              ))}
            </div>
            <Pagination pageable={pageable} fetchData={fetchData} />
          </>
        }
      />
      {selectedJob && <JobInfoDrawer job={selectedJob} onCloseDrawer={setSelectedJob} />}
    </TabContentWrapper>
  );
};

export default InboxContent;
