import {
  Button,
  DataTable,
  fetchDataParams,
  NestedSelect,
  PaginatedFetchData,
  Pagination,
  ResourceFilter,
  Select,
  TabContentProps,
  LoadingContainer,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';
import {
  fetchComposerData,
  fetchComposerDataSuccess,
  resetComposer,
} from '#PrototypeComposer/actions';
import { JobLogColumnType, LogType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { setAuditLogFilters, setPdfColumns } from '#store/audit-log-filters/action';
import { openLinkInNewTab } from '#utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { filtersToQueryParams } from '#utils/filtersToQueryParams';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { fetchJobLogsExcel } from '#views/Checklists/JobLogs/actions';
import FiltersDrawer from '#views/Checklists/JobLogs/Overlays/FiltersDrawer';
import {
  fetchChecklists,
  fetchProcessLogs,
  saveCustomView,
} from '#views/Checklists/ListView/actions';
import { CustomView } from '#views/Checklists/ListView/types';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { GetAppOutlined } from '@material-ui/icons';
import TuneIcon from '@material-ui/icons/Tune';
import { debounce, isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { commonColumns } from '.';

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
    }
    .button-download {
      color: #005dcc;
      display: flex;
      align-items: center;
      margin-left: 16px;
      height: 24px;
      width: 24px;
    }
    .process-filter {
      margin-left: unset;
    }
  }
`;

const DynamicContent: FC<TabContentProps> = ({ values }) => {
  const { id } = values;
  const dispatch = useDispatch();
  const {
    prototypeComposer: { loading: loadingProcess, data },
    checklistListView: {
      checklists,
      pageable: processListPageable,
      loading: loadingProcessList,
      jobLogs: { list, loading: logsLoading, pageable },
      customViews,
    },
    auth: { selectedFacility, selectedUseCase },
  } = useTypedSelector((state) => state);
  const { loading: customViewLoading } = customViews;
  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const [state, setState] = useState<{
    viewDetails?: CustomView;
    columns: DataTableColumn[];
    showDrawer: boolean;
    isChanged: boolean;
    checklistId?: string;
  }>({
    columns: [],
    showDrawer: false,
    isChanged: false,
  });
  const { columns, showDrawer, viewDetails, isChanged, checklistId } = state;

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

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    if (id)
      dispatch(
        fetchProcessLogs({
          page,
          size,
          filters: {
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
              if (column.triggerType === 'RESOURCE') {
                const rowValue = row[column.id + column.triggerType];
                const cellValue = Object.values(rowValue.resourceParameters).reduce<any[]>(
                  (acc, p: any) => {
                    acc.push(
                      `${p.displayName}: ${p.choices
                        .map((c: any) => c.objectDisplayName)
                        .join(',')}`,
                    );
                    return acc;
                  },
                  [],
                );
                return cellValue.join(',');
              }
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

  useEffect(() => {
    if (checklistId && !data) {
      dispatch(fetchComposerData({ entity: ComposerEntity.CHECKLIST, id: checklistId }));
    }

    return () => {
      dispatch(resetComposer());
    };
  }, [checklistId]);

  const onResetToDefault = () => {
    const _viewDetails = customViews.views?.[id];
    setState((prev) => ({
      ...prev,
      viewDetails: _viewDetails,
      isChanged: false,
      checklistId: (_viewDetails?.filters || []).find((filter) => filter.key === 'checklistId')
        ?.value,
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

  const onClearResourceFilter = () => {
    setFilterFields([]);
  };

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
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }, false));
  };

  const onSelectUpdate = (option: any) => {
    if (option) {
      dispatch(
        fetchComposerDataSuccess({
          entity: ComposerEntity.CHECKLIST,
          data: option,
        }),
      );
      setState((prev) => {
        const previousSelectProcess = (prev.viewDetails?.filters || []).find(
          (f) => f.key === 'checklistId',
        );
        if (previousSelectProcess?.value === option.id) {
          return prev;
        }
        let updatedFilters = prev.viewDetails?.filters;
        if (previousSelectProcess) {
          updatedFilters = prev.viewDetails?.filters.filter(
            (f) => f.key !== 'checklistId' && f.key.split('.')[0] !== 'parameterValues',
          );
        }
        const upDatedViewDetails = prev.viewDetails
          ? {
              ...prev.viewDetails,
              filters: [
                ...(updatedFilters || []),
                {
                  key: 'checklistId',
                  constraint: FilterOperators.EQ,
                  value: option.id,
                  displayName: option.label,
                },
              ],
              columns: (option.jobLogColumns || []).map((column: any, i: number) => ({
                ...column,
                orderTree: i + 1,
              })),
            }
          : prev.viewDetails;
        return {
          ...prev,
          viewDetails: upDatedViewDetails,
          isChanged: compareKeys('filters', upDatedViewDetails),
          checklistId: option.id,
        };
      });
    } else {
      dispatch(resetComposer());
      setState((prev) => {
        const upDatedViewDetails = prev.viewDetails
          ? {
              ...prev.viewDetails,
              filters: (viewDetails?.filters || []).filter(
                (filter) => filter.key !== 'checklistId',
              ),
              columns: commonColumns,
            }
          : prev.viewDetails;
        return {
          ...prev,
          viewDetails: upDatedViewDetails,
          isChanged: compareKeys('filters', upDatedViewDetails),
          checklistId: undefined,
        };
      });
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!processListPageable.last) fetchChecklistData({ page: processListPageable.page + 1 });
  };

  return (
    <JobLogsTabWrapper>
      <TabContentWrapper>
        <div className="filters">
          <Select
            className="process-filter"
            style={{ marginLeft: 'unset' }}
            backspaceRemovesValue={false}
            hideSelectedOptions={false}
            onChange={onSelectUpdate}
            isLoading={loadingProcessList}
            onInputChange={debounce((searchedValue: string, actionMeta) => {
              if (searchedValue !== actionMeta.prevInputValue)
                fetchChecklistData({ page: DEFAULT_PAGE_NUMBER, query: searchedValue });
            }, 500)}
            options={checklists.map((currList) => ({ ...currList, label: currList.name }))}
            placeholder="Processes"
            tabSelectsValue={false}
            onMenuScrollToBottom={handleMenuScrollToBottom}
            optional
            {...(data?.name && {
              value: { label: data?.name, value: checklistId },
            })}
          />
          <ResourceFilter onChange={onChildChange} onClear={onClearResourceFilter} />
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
              <TuneIcon />
              Configure Columns <span>{`(${viewDetails?.columns.length || 0})`}</span>
            </Button>
            <Button
              variant="textOnly"
              onClick={() => {
                setState((prev) => ({ ...prev, showDrawer: true }));
              }}
            >
              <TuneIcon />
              Filters{' '}
              <span>{`(${
                (viewDetails?.filters || []).filter((f) => f.key !== 'checklistId').length || 0
              })`}</span>
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
          loading={loadingProcess || logsLoading}
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
                emptyTitle="No Jobs Found"
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
