import { BodyWrapper, Button, DataTable } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { DataTableColumn } from '#components/shared/DataTable';
import { fetchComposerData, resetComposer } from '#PrototypeComposer/actions';
import { LogType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper, ViewWrapper } from '#views/Jobs/ListView/styles';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs } from './ListView/actions';

const TrainingUserWrapper = styled(ViewWrapper)`
  .list-table {
    grid-template-rows: 0px minmax(0, 1fr);
  }

  .file-links {
    display: flex;
    a {
      margin-right: 8px;
    }
  }
`;

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

type Props = RouteComponentProps<{ id: string }>;

const Logs: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: { loading: loadingChecklist, data },
    checklistListView: { pageable, loading, jobLogs },
    auth: { userId },
  } = useTypedSelector((state) => state);
  const [state, setState] = useState<{
    allColumns: DataTableColumn[];
    columns: DataTableColumn[];
    unSelectedColumnIds: Record<string, boolean>;
  }>({
    allColumns: [],
    columns: [],
    unSelectedColumnIds:
      JSON.parse(localStorage.getItem('jobLogsUnSelectedColumnIds') || '{}')?.[
        `${userId!}_${id}`
      ] || {},
  });
  const { columns, allColumns, unSelectedColumnIds } = state;

  const onColumnSelection = (_unSelectedColumnIds: Record<string, boolean>) => {
    setState((prev) => ({
      ...prev,
      unSelectedColumnIds: _unSelectedColumnIds,
    }));
    const jobLogsUnSelectedColumnIds = JSON.parse(
      localStorage.getItem('jobLogsUnSelectedColumnIds') || '{}',
    );
    localStorage.setItem(
      'jobLogsUnSelectedColumnIds',
      JSON.stringify({ ...jobLogsUnSelectedColumnIds, [`${userId!}_${id}`]: _unSelectedColumnIds }),
    );
  };

  const fetchData = (
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    filtersArr?: FilterField[],
  ) => {
    if (id) dispatch(fetchProcessLogs(id));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity: ComposerEntity.CHECKLIST, id }));
      fetchData();
    }
    return () => {
      dispatch(resetComposer());
    };
  }, [id]);

  useEffect(() => {
    if (data?.jobLogColumns?.length) {
      const result = data.jobLogColumns.reduce<{
        columns: DataTableColumn[];
        allColumns: DataTableColumn[];
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
          if (!unSelectedColumnIds?.[_id]) {
            acc.columns.push(_column);
          }
          acc.allColumns.push(_column);

          return acc;
        },
        { columns: [], allColumns: [] },
      );

      setState((prev) => ({
        ...prev,
        ...result,
      }));
    }
  }, [data?.jobLogColumns, unSelectedColumnIds]);

  // const showPaginationArrows = pageable.totalPages > 10;

  return (
    <TrainingUserWrapper>
      <div className="header">
        <div className="heading">Job Logs</div>
        <div className="sub-heading">View your Job Logs</div>
      </div>

      <div className="list-table">
        <BodyWrapper>
          <LoadingContainer
            loading={false}
            component={
              <TabContentWrapper>
                <div className="filters">
                  <Button
                    id="create"
                    onClick={() => {
                      dispatch(
                        openOverlayAction({
                          type: OverlayNames.CONFIGURE_COLUMNS,
                          props: {
                            columns: allColumns,
                            unSelectedColumnIds,
                            onColumnSelection,
                          },
                        }),
                      );
                    }}
                  >
                    Configure Columns
                  </Button>
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
                {/* <div className="pagination">
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
                </div> */}
              </TabContentWrapper>
            }
          />
        </BodyWrapper>
      </div>
    </TrainingUserWrapper>
  );
};

export default Logs;
