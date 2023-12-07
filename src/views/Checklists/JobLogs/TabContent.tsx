import { fetchComposerData } from '#PrototypeComposer/actions';
import { LogType, TriggerTypeEnum } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { CustomTag, DataTable, LoadingContainer, Pagination, TabContentProps } from '#components';
import { DataTableColumn } from '#components/shared/DataTable';
import { useTypedSelector } from '#store';
import { openLinkInNewTab } from '#utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, InputTypes, fetchDataParams } from '#utils/globalTypes';
import { fileTypeCheck } from '#utils/parameterUtils';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchProcessLogs } from '../ListView/actions';
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
    div {
      color: #1d84ff;
      margin-right: 8px;
      cursor: pointer;
    }
  }
`;

interface ColumnsResult {
  columns: DataTableColumn[];
}

export const logsParser = (log: any, jobId: string, resourceParameterChoicesMap: any) => {
  switch (log.triggerType) {
    case TriggerTypeEnum.RESOURCE_PARAMETER:
      const selectedChoices = (
        resourceParameterChoicesMap?.[jobId]?.[log.entityId]?.choices || []
      ).reduce((acc: any[], c: any) => {
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

export const getFormattedJobLogs = (jobLogColumns: any) => {
  // Filtering out the self and peer verification timestamp columns as we don't want to show them.

  const updatedColumns = jobLogColumns.filter((item: any) => {
    return (
      item.triggerType !== TriggerTypeEnum.PARAMETER_SELF_VERIFIED_AT &&
      item.triggerType !== TriggerTypeEnum.PARAMETER_PEER_VERIFIED_AT
    );
  });

  const result = (updatedColumns || []).reduce(
    (acc: ColumnsResult, column: any) => {
      const _id = column.id + column.triggerType;
      const _column = {
        id: _id,
        label: column.displayName,
        minWidth: `${
          (column.displayName.length > 40
            ? column.displayName.length / 3
            : column.displayName.length + 10) + 5
        }ch`,
        format: (row: any) => {
          if (row[column.id + column.triggerType]) {
            if (column.triggerType === TriggerTypeEnum.RESOURCE) {
              const rowValue = row[column.id + column.triggerType];
              const cellValue = Object.values(rowValue.resourceParameters).reduce<any[]>(
                (acc, p: any) => {
                  acc.push(
                    `${p.displayName}: ${p.choices
                      .map((c: any) => `${c.objectDisplayName} (ID: ${c.objectExternalId})`)
                      .join(', ')}`,
                  );
                  return acc;
                },
                [],
              );
              return cellValue.join(',');
            }
            if (column.triggerType === TriggerTypeEnum.JOB_ID) {
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
            } else if (column.triggerType === TriggerTypeEnum.PARAMETER_SELF_VERIFIED_BY) {
              const selfVerifiedAt =
                row[column.id + TriggerTypeEnum.PARAMETER_SELF_VERIFIED_AT]?.value;
              return (
                <>
                  {row[column.id + column.triggerType].value ? (
                    <span title={row[column.id + column.triggerType].value}>
                      Perfomed at {formatDateTime({ value: selfVerifiedAt })}, by{' '}
                      {row[column.id + column.triggerType].value}
                    </span>
                  ) : (
                    '-'
                  )}
                </>
              );
            } else if (column.triggerType === TriggerTypeEnum.PARAMETER_PEER_VERIFIED_BY) {
              const peerVerifiedAt =
                row[column.id + TriggerTypeEnum.PARAMETER_PEER_VERIFIED_AT]?.value;
              return (
                <>
                  {row[column.id + column.triggerType].value ? (
                    <span title={row[column.id + column.triggerType].value}>
                      Perfomed at {formatDateTime({ value: peerVerifiedAt })}, by{' '}
                      {row[column.id + column.triggerType].value}
                    </span>
                  ) : (
                    '-'
                  )}
                </>
              );
            }

            if (column.type === LogType.DATE) {
              return formatDateTime({
                value: row[column.id + column.triggerType].value,
                type: InputTypes.DATE,
              });
            } else if (column.type === LogType.DATE_TIME) {
              return formatDateTime({
                value: row[column.id + column.triggerType].value,
                type: InputTypes.DATE_TIME,
              });
            } else if (column.type === LogType.TIME) {
              return formatDateTime({
                value: row[column.id + column.triggerType].value,
                type: InputTypes.TIME,
              });
            } else if (
              column.type === LogType.FILE &&
              row[column.id + column.triggerType]?.medias?.length
            ) {
              return (
                <div className="file-links">
                  {row[column.id + column.triggerType].medias.map((media: any) => {
                    const mediaType = media?.type?.split('/')[1];
                    const isImage = fileTypeCheck(['png', 'jpg', 'jpeg'], mediaType);
                    return (
                      <CustomTag
                        as={isImage ? 'a' : 'div'}
                        target={isImage ? '_blank' : undefined}
                        href={isImage ? media.link : undefined}
                        onClick={
                          isImage
                            ? undefined
                            : () => {
                                const queryString = new URLSearchParams({
                                  link: media.link,
                                }).toString();
                                openLinkInNewTab(
                                  `/jobs/${
                                    row[column.id + column.triggerType].jobId
                                  }/fileUpload/print?${queryString}`,
                                );
                              }
                        }
                      >
                        <span> {media.name}</span>
                      </CustomTag>
                    );
                  })}
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

  return result;
};

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
  const resourceParameterChoicesMap = useRef(logsResourceChoicesMapper(list));

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE, filters = [] } = params;
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
      const result = getFormattedJobLogs(data.jobLogColumns);

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
                  acc[index] = {
                    ...acc[index],
                    [log.entityId + log.triggerType]: logsParser(
                      { ...log, jobId: jobLog.id },
                      jobLog.id,
                      resourceParameterChoicesMap.current,
                    ),
                  };
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
