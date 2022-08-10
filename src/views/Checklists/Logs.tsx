import { BodyWrapper, DataTable } from '#components';
import { fetchComposerData, resetComposer } from '#PrototypeComposer/actions';
import { LogType } from '#PrototypeComposer/checklist.types';
import { ComposerEntity } from '#PrototypeComposer/types';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { TabContentWrapper, ViewWrapper } from '#views/Jobs/NewListView/styles';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
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
  } = useTypedSelector((state) => state);

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity: ComposerEntity.CHECKLIST, id }));
      fetchData();
    }
    return () => {
      dispatch(resetComposer());
    };
  }, [id]);

  const fetchData = (
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    filtersArr?: FilterField[],
  ) => {
    if (id) dispatch(fetchProcessLogs(id));
  };

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
                <DataTable
                  columns={(data?.jobLogColumns || []).map((column) => ({
                    id: column.id + column.triggerType,
                    label: column.displayName,
                    minWidth: `${
                      (column.displayName.length > 30
                        ? column.displayName.length / 3
                        : column.displayName.length + 10) + 5
                    }ch`,
                    format: (row: any) => {
                      if (row[column.id + column.triggerType]) {
                        if (column.type === LogType.DATE) {
                          return formatDateTime(
                            row[column.id + column.triggerType].value,
                          );
                        } else if (
                          column.type === LogType.FILE &&
                          row[column.id + column.triggerType]?.medias?.length
                        ) {
                          return (
                            <div className="file-links">
                              {row[column.id + column.triggerType].medias.map(
                                (media: any) => (
                                  <a
                                    target="_blank"
                                    title={media.name}
                                    href={media.link}
                                  >
                                    {media.name}
                                  </a>
                                ),
                              )}
                            </div>
                          );
                        }
                        return (
                          <span
                            title={row[column.id + column.triggerType].value}
                          >
                            {row[column.id + column.triggerType].value}
                          </span>
                        );
                      }
                      return '-';
                    },
                  }))}
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
