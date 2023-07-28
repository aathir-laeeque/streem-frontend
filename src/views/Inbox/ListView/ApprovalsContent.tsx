import React, { FC, useEffect, useState } from 'react';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { debounce } from 'lodash';
import { Search } from '@material-ui/icons';
import { DataTable, LoadingContainer, Pagination, TextInput } from '#components';
import { formatDateTime } from '#utils/timeUtils';
import { navigate } from '@reach/router';
import { apiGetShouldBeApprovals } from '#utils/apiUrls';
import { createFetchList } from '#hooks/useFetchData';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
  sort: 'createdAt,desc',
};

const ApprovalsContent: FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);

  const { list, reset, pagination, status } = createFetchList(
    apiGetShouldBeApprovals(),
    urlParams,
    false,
  );

  useEffect(() => {
    reset({ params: { ...filters } });
  }, [filters]);

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
                  format: (item) => formatDateTime(item.modifiedAt, 'DD/MM/YYYY'),
                },
                {
                  id: 'action',
                  label: 'Action',
                  minWidth: 100,
                  format: (item) => {
                    return (
                      <span
                        className="primary"
                        onClick={() => {
                          navigate(`/inbox/${item.jobId}`, {
                            state: {
                              verificationTaskId: item?.taskId,
                              VerificationStageId: item?.stageId,
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
