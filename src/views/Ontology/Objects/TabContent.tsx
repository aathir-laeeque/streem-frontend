import { Button, DataTable, LoadingContainer, PaginatedFetchData, Pagination } from '#components';
import { useTypedSelector } from '#store';
import {
  clearAuditLogFilters,
  setAuditLogFilters,
  setPdfMetaData,
} from '#store/audit-log-filters/action';
import { openLinkInNewTab } from '#utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterField, FilterOperators, InputTypes } from '#utils/globalTypes';
import { formatDateByInputType } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import TuneIcon from '@material-ui/icons/Tune';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchObjectChangeLogs } from '../actions';
import { Constraint } from '../types';
import FiltersDrawer from './Overlays/FilterDrawer';

const AuditLogsTabWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  .file-links {
    display: flex;
    a {
      margin-right: 8px;
    }
  }

  .filters {
    gap: 12px;
    .filter-buttons-wrapper {
      display: flex;
      margin-left: 10px;
      align-items: center;
      button {
        margin-right: 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding-block: 6px;
        :last-of-type {
          margin-right: 0;
        }
      }
    }
  }
`;

const TabContent: FC = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<{
    showDrawer: boolean;
    filterFields: FilterField[];
  }>({
    showDrawer: false,
    filterFields: [],
  });
  const { showDrawer, filterFields } = state;
  const {
    objectChangeLogs: { list, listLoading, pageable },
    objects: { active: activeObject },
  } = useTypedSelector((state) => state.ontology);
  const { selectedFacility } = useTypedSelector((state) => state.auth);
  const objectId = activeObject?.id;
  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    if (objectId) {
      dispatch(
        fetchObjectChangeLogs({
          page,
          size,
          filters: {
            op: FilterOperators.AND,
            fields: [
              ...filters,
              {
                field: 'objectId',
                op: FilterOperators.EQ,
                values: [objectId],
              },
              { field: 'facilityId', op: 'EQ', values: [selectedFacility?.id] },
            ],
          },
        }),
      );
    }
  };

  const dataParser = (type: string, data: Record<string, any>) => {
    switch (type) {
      case InputTypes.DATE_TIME:
      case InputTypes.DATE:
        return formatDateByInputType(type, data?.input);
      default:
        return data?.input;
    }
  };

  const onApplyFilters = (newFilters) => {
    const parsedFilters = newFilters.map((currFilter) => {
      if (currFilter?.value?.value === 'usageStatus.new') {
        return {
          values: currFilter.constraint === Constraint.EQ ? [1, 7] : [null],
          op: Constraint.ANY,
          field: currFilter.value.value,
        };
      } else {
        return {
          values:
            typeof currFilter.value === 'number' ? [currFilter.value] : [currFilter.value.value],
          op: currFilter.constraint,
          field: currFilter.key,
        };
      }
    });
    setState((prev) => ({
      ...prev,
      filterFields: newFilters,
    }));
    fetchData({ filters: parsedFilters });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(
      setAuditLogFilters(
        JSON.stringify({
          op: FilterOperators.AND,
          fields: [
            ...filterFields,
            {
              field: 'objectId',
              op: FilterOperators.EQ,
              values: [objectId],
            },
            {
              field: 'facilityId',
              op: FilterOperators.EQ,
              values: [selectedFacility?.id],
            },
          ],
        }),
      ),
    );

    return () => {
      dispatch(clearAuditLogFilters());
    };
  }, [filterFields]);

  return (
    <AuditLogsTabWrapper>
      <LoadingContainer
        loading={listLoading}
        component={
          <TabContentWrapper>
            <div className="filters">
              <div className="filter-buttons-wrapper">
                <Button
                  variant="textOnly"
                  onClick={() => {
                    setState((prev) => ({ ...prev, showDrawer: true }));
                  }}
                >
                  <TuneIcon />
                </Button>
                <Button
                  variant="textOnly"
                  onClick={() => {
                    dispatch(
                      setPdfMetaData({
                        objectTypeDisplayName: activeObject?.objectType?.displayName!,
                        objectDisplayName: activeObject?.displayName!,
                        objectExternalId: activeObject?.externalId!,
                      }),
                    );
                    openLinkInNewTab(`/object-change-logs/${objectId}/print`);
                  }}
                >
                  <GetAppOutlinedIcon />
                </Button>
              </div>
            </div>
            <DataTable
              columns={[
                {
                  id: 'changedoneto',
                  label: 'Change Done To',
                  minWidth: 152,
                  format: function renderComp(item) {
                    const contentString = item?.entityDisplayName
                      ? item?.entityDisplayName
                      : 'Usage Status';
                    return <div key={item?.id}>{contentString}</div>;
                  },
                },
                {
                  id: 'changeto',
                  label: 'Change To',
                  minWidth: 152,
                  format: function renderComp(item) {
                    let contentString;

                    if (item.new) {
                      item?.new?.forEach((currData: Record<string, any>) => {
                        contentString = dataParser(item?.entityInputType, currData);
                      });
                    } else {
                      item.usageStatus.new === 1
                        ? (contentString = 'Active')
                        : (contentString = 'Archived');
                    }
                    return <div key={item?.id}>{contentString}</div>;
                  },
                },
                {
                  id: 'changedoneat',
                  label: 'Change Done At',
                  minWidth: 152,
                  format: function renderComp(item) {
                    return (
                      <div key={item?.id}>
                        {item?.modifiedAt
                          ? formatDateByInputType(InputTypes.DATE_TIME, item?.modifiedAt)
                          : 'N/A'}
                      </div>
                    );
                  },
                },
                {
                  id: 'changedoneby',
                  label: 'Change Done By',
                  minWidth: 152,
                  format: function renderComp(item) {
                    return (
                      <div key={item?.id}>
                        {`${item?.modifiedBy?.firstName} ${item?.modifiedBy?.lastName} (ID: ${item?.modifiedBy?.employeeId})`}
                      </div>
                    );
                  },
                },
                {
                  id: 'reason',
                  label: 'Reason',
                  minWidth: 152,
                  format: function renderComp(item) {
                    const reason = item?.reason ? (
                      item?.jobInfo ? (
                        <div style={{ display: 'flex' }}>
                          {item.reason}: {item?.jobInfo?.process} (ID:
                          <span
                            className="primary"
                            onClick={() => {
                              navigate(`/jobs/${item.jobInfo.jobId}`);
                            }}
                          >
                            {item.jobInfo.jobId}
                          </span>
                          )
                        </div>
                      ) : (
                        item.reason
                      )
                    ) : (
                      '-'
                    );

                    return <div key={item?.id}>{reason}</div>;
                  },
                },
              ]}
              rows={list}
              emptyTitle="Audit Logs"
            />
            {showDrawer && (
              <FiltersDrawer
                setState={setState}
                onApplyMoreFilters={onApplyFilters}
                filters={filterFields}
              />
            )}
            <Pagination pageable={pageable} fetchData={fetchData} />
          </TabContentWrapper>
        }
      />
    </AuditLogsTabWrapper>
  );
};

export default TabContent;
