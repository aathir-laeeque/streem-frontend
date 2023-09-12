import { DataTable, LoadingContainer, Pagination, TabContentProps } from '#components';
import { DataTableColumn } from '#components/shared/DataTable';
import { fetchComposerData } from '#PrototypeComposer/actions';
import { LogType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { fetchDataParams, FilterField, FilterOperators } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import React, { FC, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs } from '../ListView/actions';
import { navigate } from '@reach/router';
import { logsResourceChoicesMapper } from './DynamicContent';

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
`;

const Logs: FC<TabContentProps> = ({ values }) => {
  const { checklistId: id } = values;
  const dispatch = useDispatch();
  const {
    prototypeComposer: { data },
    checklistListView: {
      jobLogs: { list, loading, pageable },
    },
  } = useTypedSelector((state) => state);
  const [state, setState] = useState<{
    columns: DataTableColumn[];
  }>({
    columns: [],
  });
  const { columns } = state;
  const { selectedFacility } = useTypedSelector((state) => state.auth);

  const [filterFields, setFilterFields] = useState<FilterField[]>([]);
  const resourceParameterChoicesMap = useRef(logsResourceChoicesMapper(list));

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = filterFields } = params;
    if (id)
      dispatch(
        fetchProcessLogs({
          page,
          size,
          sort: 'id,desc',
          filters: {
            op: FilterOperators.AND,
            fields: [
              ...filters,
              {
                field: 'facilityId',
                op: FilterOperators.EQ,
                values: [selectedFacility?.id],
              },
              { field: 'checklistId', op: FilterOperators.EQ, values: [id] },
            ],
          },
        }),
      );
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity: ComposerEntity.CHECKLIST, id }));
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (data?.jobLogColumns?.length) {
      const result = data.jobLogColumns.reduce<{
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
                if (column.triggerType === 'JOB_ID') {
                  return (
                    <span
                      title={row[column.id + column.triggerType].value}
                      className="primary"
                      onClick={() => {
                        navigate(`/jobs/${row[column.id + column.triggerType].jobId}`);
                      }}
                    >
                      {row[column.id + column.triggerType].value}
                    </span>
                  );
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
    }
  }, [data?.jobLogColumns]);

  useEffect(() => {
    if (list.length) {
      resourceParameterChoicesMap.current = logsResourceChoicesMapper(list);
    }
  }, [list]);

  const logsParser = (log: any, jobId: string) => {
    switch (log.triggerType) {
      case 'RESOURCE_PARAMETER':
        const selectedChoices = (
          resourceParameterChoicesMap.current?.[jobId]?.[log.entityId]?.choices || []
        ).reduce<any[]>((acc: any[], c: any) => {
          acc.push(`${c?.objectDisplayName} (ID: ${c?.objectExternalId})`);
          return acc;
        }, []);

        return {
          ...log,
          value: selectedChoices?.join(', '),
        };
      default:
        return log;
    }
  };

  return (
    <JobLogsTabWrapper>
      <LoadingContainer
        loading={loading}
        component={
          <TabContentWrapper>
            <DataTable
              columns={columns}
              rows={list.reduce((acc, jobLog, index) => {
                jobLog.logs.forEach((log: any) => {
                  if (log.triggerType === 'JOB_ID') {
                    acc[index] = {
                      ...acc[index],
                      [log.entityId + log.triggerType]: logsParser(
                        { ...log, jobId: jobLog.id },
                        jobLog.id,
                      ),
                    };
                  } else {
                    acc[index] = {
                      ...acc[index],
                      [log.entityId + log.triggerType]: logsParser(log, jobLog.id),
                    };
                  }
                });
                return acc;
              }, [])}
              emptyTitle="No Job Logs Found"
            />
            <Pagination pageable={pageable} fetchData={fetchData} />
          </TabContentWrapper>
        }
      />
    </JobLogsTabWrapper>
  );
};

export default Logs;
