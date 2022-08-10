import { BodyWrapper, DataTable } from '#components';
import { useTypedSelector } from '#store';
import cronstrue from 'cronstrue';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper, ViewWrapper } from '#views/Jobs/NewListView/styles';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchAutomations } from './ListView/actions';
import { Automation, AutomationVisual } from './ListView/types';

const AutomationWrapper = styled(ViewWrapper)`
  .list-table {
    grid-template-rows: 0px minmax(0, 1fr);
  }
`;

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBaseFilter = (checklistId: string): FilterField[] => [
  {
    field: 'entityId',
    op: FilterOperators.EQ,
    values: [checklistId],
  },
  { field: 'archived', op: FilterOperators.EQ, values: [false] },
];

type Props = RouteComponentProps<{ id: string }>;

const Automation: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const {
    checklistListView: { pageable, loading, automations },
  } = useTypedSelector((state) => state);

  const [filterFields, setFilterFields] = useState<FilterField[]>(getBaseFilter(id!));

  const fetchData = (page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE) => {
    if (id)
      dispatch(
        fetchAutomations({
          page,
          size,
          filters: JSON.stringify({
            op: FilterOperators.AND,
            fields: filterFields,
          }),
        }),
      );
  };

  useEffect(() => {
    console.log('in mount of automations');
    fetchData();
  }, [filterFields]);

  const showPaginationArrows = pageable.totalPages > 10;

  return (
    <AutomationWrapper>
      <div className="header">
        <div className="heading">Automations</div>
      </div>

      <div className="list-table">
        <BodyWrapper>
          <LoadingContainer
            loading={loading}
            component={
              <TabContentWrapper>
                <DataTable
                  columns={[
                    {
                      id: 'action',
                      label: 'Automate',
                      minWidth: 240,
                      format: (item: Automation) => AutomationVisual[item.action],
                    },
                    {
                      id: 'details',
                      label: 'Automation Details',
                      minWidth: 152,
                      format: (item: Automation) =>
                        cronstrue.toString(item.cron, { verbose: true }),
                    },
                  ]}
                  rows={automations}
                />
                <div className="pagination">
                  <ArrowLeft
                    className={`icon ${showPaginationArrows ? '' : 'hide'}`}
                    onClick={() => {
                      if (pageable.page > 0) {
                        fetchData(pageable.page - 1, DEFAULT_PAGE_SIZE);
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
                        onClick={() => fetchData(el, DEFAULT_PAGE_SIZE)}
                      >
                        {el + 1}
                      </span>
                    ))}
                  <ArrowRight
                    className={`icon ${showPaginationArrows ? '' : 'hide'}`}
                    onClick={() => {
                      if (pageable.page < pageable.totalPages - 1) {
                        fetchData(pageable.page + 1, DEFAULT_PAGE_SIZE);
                      }
                    }}
                  />
                </div>
              </TabContentWrapper>
            }
          />
        </BodyWrapper>
      </div>
    </AutomationWrapper>
  );
};

export default Automation;
