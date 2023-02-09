import {
  Button,
  DataTable,
  LoadingContainer,
  NestedSelect,
  Pagination,
  ResourceFilter,
  Select,
  TabContentProps,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';
import { JobLogColumnType, LogType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { setAuditLogFilters, setPdfColumns } from '#store/audit-log-filters/action';
import { openLinkInNewTab } from '#utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { filtersToQueryParams } from '#utils/filtersToQueryParams';
import { fetchDataParams, FilterField, FilterOperators } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { GetAppOutlined, Tune } from '@material-ui/icons';
import { isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs, saveCustomView } from '../ListView/actions';
import { CustomView } from '../ListView/types';
import { fetchJobLogsExcel } from './actions';
import FiltersDrawer from './Overlays/FiltersDrawer';

const JobLogsTabWrapper = styled.div`
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
      .button-download {
        color: #005dcc;
        display: flex;
        align-items: center;
        margin-left: 16px;
        height: 24px;
        width: 24px;
      }
    }
  }
`;

const DynamicContent: FC<TabContentProps> = ({ values }) => {
  const { id, checklistId } = values;
  const dispatch = useDispatch();
  const {
    prototypeComposer: { data },
    checklistListView: {
      loading,
      jobLogs: { list, loading: logsLoading, pageable },
      customViews,
    },
    auth: { selectedFacility },
  } = useTypedSelector((state) => state);
  const { loading: customViewLoading } = customViews;
  const [filterFields, setFilterFields] = useState<FilterField[]>([
    {
      field: 'facilityId',
      op: FilterOperators.EQ,
      values: [selectedFacility!.id],
    },
  ]);

  const [state, setState] = useState<{
    viewDetails?: CustomView;
    columns: DataTableColumn[];
    showDrawer: boolean;
    isChanged: boolean;
  }>({
    columns: [],
    showDrawer: false,
    isChanged: false,
  });
  const { columns, showDrawer, viewDetails, isChanged } = state;

  const compareKeys = (key: keyof CustomView, _viewDetails = viewDetails) => {
    let _isChanged = isChanged;
    if (!isChanged && _viewDetails) {
      _isChanged = !isEqual(_viewDetails?.[key], customViews.views?.[id]?.[key]);
    }
    return _isChanged;
  };

  const onColumnSelection = (selectedColumns: JobLogColumnType[]) => {
    setState((prev) => {
      const upDatedViewDetails = prev.viewDetails
        ? { ...prev.viewDetails, columns: selectedColumns }
        : prev.viewDetails;
      return {
        ...prev,
        viewDetails: upDatedViewDetails,
        isChanged: compareKeys('columns', upDatedViewDetails),
      };
    });
  };

  const onApplyMoreFilters = (newFilters: any[]) => {
    setState((prev) => {
      const upDatedViewDetails = prev.viewDetails
        ? { ...prev.viewDetails, filters: newFilters }
        : prev.viewDetails;
      return {
        ...prev,
        viewDetails: upDatedViewDetails,
        isChanged: compareKeys('filters', upDatedViewDetails),
      };
    });
  };

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    if (id)
      dispatch(
        fetchProcessLogs({
          page,
          size,
          filters: {
            op: FilterOperators.AND,
            fields: [...filters, ...filtersToQueryParams(viewDetails?.filters || [])],
          },
          sort: 'id,desc',
        }),
      );

    dispatch(
      setAuditLogFilters(
        JSON.stringify({
          op: FilterOperators.AND,
          fields: [
            ...filters,
            ...filtersToQueryParams(viewDetails?.filters || []),
            {
              field: 'facilityId',
              op: FilterOperators.EQ,
              values: [selectedFacility?.id],
            },
          ],
        }),
      ),
    );
    dispatch(setPdfColumns(viewDetails?.columns || []));
  };

  useEffect(() => {
    if (viewDetails?.filters && filterFields) {
      fetchData();
    }
  }, [viewDetails?.filters, filterFields]);

  useEffect(() => {
    onResetToDefault();
  }, [id, customViews.views?.[id]]);

  useEffect(() => {
    const result = (viewDetails?.columns || []).reduce<{
      columns: DataTableColumn[];
    }>(
      (acc, column) => {
        const _id = column.id + column.triggerType;
        const _column = {
          id: _id,
          label: column.displayName,
          minWidth: `${
            (column.displayName.length > 30
              ? column.displayName.length / 3
              : column.displayName.length + 10) + 5
          }ch`,
          format: (row: any) => {
            if (row[column.id + column.triggerType]) {
              if (column.type === LogType.DATE) {
                return formatDateTime(row[column.id + column.triggerType].value);
              } else if (
                column.type === LogType.FILE &&
                row[column.id + column.triggerType]?.medias?.length
              ) {
                return (
                  <div className="file-links">
                    {row[column.id + column.triggerType].medias.map((media: any) => (
                      <a target="_blank" title={media.name} href={media.link}>
                        {media.name}
                      </a>
                    ))}
                  </div>
                );
              }
              return (
                <span title={row[column.id + column.triggerType].value}>
                  {row[column.id + column.triggerType].value}
                </span>
              );
            }
            return '-';
          },
        };
        acc.columns.push(_column);
        return acc;
      },
      { columns: [] },
    );
    setState((prev) => ({
      ...prev,
      ...result,
    }));
  }, [data?.jobLogColumns, viewDetails?.columns]);

  const onResetToDefault = () => {
    setState((prev) => ({
      ...prev,
      viewDetails: customViews.views?.[id],
      isChanged: false,
    }));
  };

  const onSaveView = () => {
    if (id && viewDetails) {
      dispatch(
        saveCustomView({
          data: viewDetails,
          viewId: id,
        }),
      );
    }
  };

  const onChildChange = (option: any) => {
    setFilterFields((prev) => [
      ...prev,
      { field: 'logs.triggerType', op: FilterOperators.EQ, values: ['RESOURCE_PARAMETER'] },
      {
        field: 'logs.identifierValue',
        op: FilterOperators.EQ,
        values: [option.id],
      },
    ]);
  };

  return (
    <JobLogsTabWrapper>
      <TabContentWrapper>
        <div className="filters">
          <Select
            label="Processes"
            style={{ width: '200px' }}
            isDisabled
            value={{ label: data?.name }}
          />
          <ResourceFilter onChange={onChildChange} onClear={() => setFilterFields([])} />
          <div className="filter-buttons-wrapper">
            <Button
              variant="textOnly"
              onClick={() => {
                dispatch(
                  openOverlayAction({
                    type: OverlayNames.CONFIGURE_COLUMNS,
                    props: {
                      selectedColumns: viewDetails?.columns || [],
                      columns: data?.jobLogColumns || [],
                      onColumnSelection,
                    },
                  }),
                );
              }}
            >
              <Tune />
              Configure Columns <span>{`(${viewDetails?.columns.length || 0})`}</span>
            </Button>
            <Button
              variant="textOnly"
              onClick={() => {
                setState((prev) => ({ ...prev, showDrawer: true }));
              }}
            >
              <Tune />
              Filters <span>{`(${viewDetails?.filters.length || 0})`}</span>
            </Button>
            <NestedSelect
              id="download-logs"
              label={() => <GetAppOutlined className="button-download" />}
              items={{
                excel: {
                  label: 'Excel',
                },
                pdf: {
                  label: 'PDF',
                },
              }}
              onChildChange={(option: any) => {
                if (option.value === 'excel') {
                  dispatch(
                    fetchJobLogsExcel({
                      customViewId: id,
                      ...(filterFields.length || viewDetails?.filters?.length
                        ? {
                            filters: {
                              op: FilterOperators.AND,
                              fields: [
                                ...filterFields,
                                ...filtersToQueryParams(viewDetails?.filters || []),
                              ],
                            },
                          }
                        : {}),
                    }),
                  );
                } else {
                  openLinkInNewTab(`/job-logs/${id}/print`);
                }
              }}
            />
          </div>
          {isChanged && (
            <div id="create" style={{ display: 'flex' }}>
              {!customViewLoading && (
                <Button variant="textOnly" onClick={onResetToDefault}>
                  Reset to Default
                </Button>
              )}
              <Button variant="secondary" onClick={onSaveView} disabled={customViewLoading}>
                Save View
              </Button>
            </div>
          )}
        </div>
        <LoadingContainer
          loading={loading || logsLoading}
          component={
            <>
              <DataTable
                columns={columns}
                rows={list.reduce((acc, jobLog, index) => {
                  jobLog.logs.forEach((log: any) => {
                    acc[index] = {
                      ...acc[index],
                      [log.entityId + log.triggerType]: log,
                    };
                  });
                  return acc;
                }, [])}
              />
              <Pagination pageable={pageable} fetchData={fetchData} />
              {showDrawer && (
                <FiltersDrawer
                  setState={setState}
                  checklistId={checklistId}
                  onApplyMoreFilters={onApplyMoreFilters}
                  filters={viewDetails?.filters || []}
                />
              )}
            </>
          }
        />
      </TabContentWrapper>
    </JobLogsTabWrapper>
  );
};

export default DynamicContent;
