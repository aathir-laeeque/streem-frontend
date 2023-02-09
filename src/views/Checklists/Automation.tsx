import {
  BodyWrapper,
  DataTable,
  GeneralHeader,
  LoadingContainer,
  Pagination,
} from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { fetchDataParams, FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper, ViewWrapper } from '#views/Jobs/ListView/styles';
import { RouteComponentProps } from '@reach/router';
import cronstrue from 'cronstrue';
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

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
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
    fetchData();
  }, [filterFields]);

  return (
    <AutomationWrapper>
      <GeneralHeader heading="Automations" />

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
                <Pagination pageable={pageable} fetchData={fetchData} />
              </TabContentWrapper>
            }
          />
        </BodyWrapper>
      </div>
    </AutomationWrapper>
  );
};

export default Automation;
