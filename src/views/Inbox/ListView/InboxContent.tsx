import { Checklist } from '#JobComposer/checklist.types';
import {
  LoadingContainer,
  Pagination,
  ResourceFilter,
  SearchFilter,
  Select,
  TabContentProps,
} from '#components';
import { useTypedSelector } from '#store/helpers';
import { apiInboxJobsCount } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators, fetchDataParams } from '#utils/globalTypes';
import { request } from '#utils/request';
import { getActiveSmartFilter } from '#utils/smartFilterUtils';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import JobCard from '#views/Jobs/Components/JobCard';
import JobInfoDrawer from '#views/Jobs/Components/JobInfo';
import { CountCardItem, CountCards } from '#views/Jobs/ListView/JobsContent';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
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

  const [activeFilterCard, setActiveFilterCard] = useState<string>('');

  const activeSmartFilters = getActiveSmartFilter(cardsValues, activeFilterCard);
  const [resourceFilter, setResourceFilter] = useState<string>('');

  const onToggleSmartFilter = (cardFilters: CountCardItem) => {
    setFilterFields((currentFields) => {
      const updatedFilterFields = [
        ...currentFields.filter((field) => !activeSmartFilters?.[field.field]),
        ...(cardFilters.label === activeFilterCard ? [] : cardFilters?.filters),
      ];
      return updatedFilterFields;
    });

    setActiveFilterCard(cardFilters.label === activeFilterCard ? '' : cardFilters.label);
  };

  const fetchCardsValues = async () => {
    const cardsResponse = await Promise.all(
      cards.map((card: any) => {
        return request('GET', apiInboxJobsCount(), {
          params: {
            objectId: resourceFilter,
            filters: {
              op: FilterOperators.AND,
              fields: [
                ...filterFields.filter((field) => !activeSmartFilters?.[field.field]),
                ...card.filters,
              ],
            },
          },
        });
      }),
    );

    let _cardsValues: any[] = [];

    cards.forEach((card: any, index: number) => {
      const cardCountValue = cardsResponse?.[index]?.data?.count;
      if (cardCountValue && cardCountValue !== 0 && cardCountValue !== '0') {
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

  const fetchData = (params: fetchDataParams = {}) => {
    const {
      page = DEFAULT_PAGE_NUMBER,
      size = DEFAULT_PAGE_SIZE,
      filters = filterFields,
      objectId = resourceFilter,
    } = params;
    dispatch(
      fetchInbox({
        facilityId,
        page,
        size,
        objectId,
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
  }, [filterFields, resourceFilter]);

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

  const onChildChange = (option: any) => {
    setResourceFilter(option.id);
  };

  return (
    <TabContentWrapper>
      {cardsValues.length > 0 && (
        <CountCards
          items={cardsValues}
          onToggleSmartFilter={onToggleSmartFilter}
          activeFilterCard={activeFilterCard}
        />
      )}
      <div className="filters">
        <SearchFilter
          label={label}
          showDropdown={false}
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
        <div className="resource-filter">
          <ResourceFilter onChange={onChildChange} onClear={() => setResourceFilter('')} />
        </div>
      </div>
      <LoadingContainer
        loading={loading}
        component={
          <>
            <JobCard jobs={jobs} setSelectedJob={setSelectedJob} view="Inbox" />
            <Pagination pageable={pageable} fetchData={fetchData} />
          </>
        }
      />
      {selectedJob && <JobInfoDrawer job={selectedJob} onCloseDrawer={setSelectedJob} />}
    </TabContentWrapper>
  );
};

export default InboxContent;
