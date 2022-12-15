import {
  Button,
  DataTable,
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
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { filtersToQueryParams } from '#utils/filtersToQueryParams';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs, saveCustomView } from '../ListView/actions';
import { CustomView } from '../ListView/types';
import FiltersDrawer from './Overlays/FiltersDrawer';
import { isEqual } from 'lodash';
import TuneIcon from '@material-ui/icons/Tune';

const JobLogsTabWrapper = styled.div`
  display: flex;
  height: 100%;
  .file-links {
    display: flex;
    a {
      margin-right: 8px;
    }
  }

  .filters {
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

const DynamicContent: FC<TabContentProps> = ({ values }) => {
  const { id, checklistId } = values;
  const dispatch = useDispatch();
  const {
    prototypeComposer: { loading: loadingChecklist, data },
    checklistListView: { pageable, loading, jobLogs, customViews },
  } = useTypedSelector((state) => state);
  const { loading: customViewLoading } = customViews;
  const { selectedFacility } = useTypedSelector((state) => state.auth);
  const [filterFields, setFilterFields] = useState<FilterField[]>([]);

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
