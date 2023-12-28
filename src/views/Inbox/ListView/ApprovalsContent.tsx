import React, { FC, useEffect, useState } from 'react';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { debounce } from 'lodash';
import { Search } from '@material-ui/icons';
import { DataTable, LoadingContainer, Pagination, ResourceFilter, TextInput } from '#components';
import { formatDateTime } from '#utils/timeUtils';
import { navigate } from '@reach/router';
import { apiGetShouldBeApprovals } from '#utils/apiUrls';
import { createFetchList } from '#hooks/useFetchData';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { useTypedSelector } from '#store';

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
  sort: 'createdAt,desc',
};

const ApprovalsContent: FC = () => {
  const { parameterResponseById } = useTypedSelector((state) => state.job);
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);
  const [resourceFilter, setResourceFilter] = useState<string>('');

  const { list, reset, pagination, status } = createFetchList(
    apiGetShouldBeApprovals(),
    urlParams,
    false,
  );

  const onChildChange = (option: any) => {
    setResourceFilter(option.id);
  };

  useEffect(() => {
    reset({ params: { ...filters, objectId: resourceFilter } });
  }, [filters, resourceFilter]);

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ width: '345px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search by Paramater or Process Name`}
            onChange={debounce(
              ({ value }) => setFilters({ ...filters, processName: value, parameterName: value }),
              500,
            )}
          />
        </div>
        <div className="select-filter">
          <ResourceFilter onChange={onChildChange} onClear={() => setResourceFilter('')} />
        </div>
      </div>
      <LoadingContainer
        loading={status === 'loading'}
        component={
          <>
            <DataTable
              columns={[
                {
                  id: 'paramterName',
                  label: 'Parameter Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.parameterName;
                  },
                },
                {
                  id: 'taskName',
                  label: 'Task Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.taskName;
                  },
                },
                {
                  id: 'processName',
                  label: 'Process Name',
                  minWidth: 100,
                  format: (item) => {
                    return item.processName;
                  },
                },
                {
                  id: 'jobId',
                  label: 'Job ID',
                  minWidth: 100,
                  format: (item) => {
                    return item.jobCode;
                  },
                },
                {
                  id: 'modifiedAt',
                  label: 'Modified At',
                  minWidth: 100,
                  format: (item) => formatDateTime({ value: item.modifiedAt }),
                },
                {
                  id: 'action',
                  label: 'Action',
                  minWidth: 100,
                  format: (item) => {
                    const taskExecutionId = item.taskExecutionId;
                    return (
                      <span
                        className="primary"
                        onClick={() => {
                          navigate(`/inbox/${item.jobId}`, {
                            state: {
                              taskExecutionId,
                            },
                          });
                        }}
                      >
                        View
                      </span>
                    );
                  },
                },
              ]}
              rows={list}
              emptyTitle="No Approvals Found"
            />
            <Pagination
              pageable={pagination}
              fetchData={(p) => reset({ params: { page: p.page, size: p.size } })}
            />
          </>
        }
      />
    </TabContentWrapper>
  );
};

export default ApprovalsContent;
