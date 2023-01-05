import {
  Button,
  DataTable,
  NestedSelect,
  NestedSelectProps,
  PaginatedFetchData,
  Pagination,
  Select,
  TabContentProps,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';
import { JobLogColumnType, LogType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetObjects } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { filtersToQueryParams } from '#utils/filtersToQueryParams';
import { FilterField, FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import { Object } from '#views/Ontology/types';
import { ExpandMore } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import TuneIcon from '@material-ui/icons/Tune';
import { isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs, saveCustomView } from '../ListView/actions';
import { CustomView } from '../ListView/types';
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
    }
  }
`;

const ResourceFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 0px 7.5px 12px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #bababa;
  color: #808ba5;

  :hover {
    border-bottom: 1px solid #005dcc;
  }

  .resource-filter-label {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .active {
    color: #000000;
  }

  .resource-filter-icons {
    display: flex;
    align-items: center;
    padding-inline: 4px 6px;
    border-left: 1px solid hsl(0, 0%, 90%);

    svg:nth-child(n) {
      height: 24px;
      width: 24px;
      &:hover {
        color: #101010;
      }
    }
  }
`;

const DynamicContent: FC<TabContentProps> = ({ values }) => {
  const { id, checklistId } = values;
  const dispatch = useDispatch();
  const {
    prototypeComposer: { loading: loadingChecklist, data },
    checklistListView: { pageable, loading, jobLogs, customViews },
    auth: { selectedFacility },
    ontology: {
      objectTypes: { list, listLoading, pageable: objectTypePagination },
    },
  } = useTypedSelector((state) => state);
  const { loading: customViewLoading } = customViews;
  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

  const [state, setState] = useState<{
    viewDetails?: CustomView;
    columns: DataTableColumn[];
    showDrawer: boolean;
    isChanged: boolean;
    resourceOptions: NestedSelectProps['items'];
    selectedResource?: Object;
  }>({
    columns: [],
    showDrawer: false,
    isChanged: false,
    resourceOptions: {},
  });
  const { columns, showDrawer, viewDetails, isChanged, resourceOptions, selectedResource } = state;

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
          id: checklistId,
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
              { field: 'checklistId', op: FilterOperators.EQ, values: [checklistId] },
            ],
          },
          sort: 'id,desc',
        }),
      );
  };

  const fetchResourcesData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;

    dispatch(
      fetchObjectTypes({
        page,
        size,
        usageStatus: 1,
      }),
    );
  };

  useEffect(() => {
    fetchResourcesData();
  }, []);

  useEffect(() => {
    if (list.length) {
      const listOptions = list.reduce<any>((acc, item) => {
        acc[item.id] = {
          label: item.displayName,
          fetchItems: async (pageNumber?: number, query = '') => {
            if (typeof pageNumber === 'number') {
              try {
                const { data: resData, pageable }: ResponseObj<any[]> = await request(
                  'GET',
                  apiGetObjects(),
                  {
                    params: {
                      page: pageNumber + 1,
                      size: DEFAULT_PAGE_SIZE,
                      collection: item.externalId,
                      filters: JSON.stringify({
                        op: FilterOperators.AND,
                        fields: [
                          ...(query
                            ? [{ field: 'displayName', op: FilterOperators.LIKE, values: [query] }]
                            : []),
                        ],
                      }),
                      usageStatus: 1,
                    },
                  },
                );
                if (resData && pageable) {
                  return {
                    options: resData.map((item) => ({
                      ...item,
                      value: item.id,
                      label: item.displayName,
                    })),
                    pageable,
                  };
                }
              } catch (e) {
                console.error('Error while fetching existing unmapped parameters', e);
              }
            }
            return {
              options: [],
            };
          },
        };
        return acc;
      }, {});
      setState((prev) => ({ ...prev, resourceOptions: listOptions }));
    }
  }, [list]);

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
    setState((prev) => ({ ...prev, selectedResource: option }));
  };

  const ResourceFilterLabel = () => {
    return (
      <ResourceFilterWrapper>
        <div
          className={
            selectedResource?.id ? 'resource-filter-label active' : 'resource-filter-label'
          }
        >
          {selectedResource?.displayName || `Resource Filter`}
        </div>
        <div className="resource-filter-icons">
          {selectedResource?.id && (
            <ClearIcon
              onMouseDown={() => {
                setState((prev) => ({ ...prev, selectedResource: undefined }));
                setFilterFields([]);
              }}
            />
          )}
          {listLoading && <MoreHorizIcon />}
          <ExpandMore />
        </div>
      </ResourceFilterWrapper>
    );
  };

  return (
    <JobLogsTabWrapper>
      <LoadingContainer
        loading={loading}
        component={
          <TabContentWrapper>
            <div className="filters">
              <Select
                label="Processes"
                style={{ width: '200px' }}
                isDisabled
                value={{ label: data?.name }}
              />
              <NestedSelect
                id="resource-filter-selector"
                width="200px"
                label={ResourceFilterLabel}
                items={resourceOptions}
                onChildChange={onChildChange}
                pagination={objectTypePagination}
                fetchData={fetchResourcesData}
                maxHeight={350}
              />
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
                  Filters <span>{`(${viewDetails?.filters.length || 0})`}</span>
                </Button>
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
            <DataTable
              columns={columns}
              rows={jobLogs.reduce((acc, jobLog, index) => {
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
          </TabContentWrapper>
        }
      />
    </JobLogsTabWrapper>
  );
};

export default DynamicContent;
