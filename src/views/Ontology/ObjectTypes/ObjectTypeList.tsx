import {
  Button,
  DataTable,
  LoadingContainer,
  Pagination,
  TabContentProps,
  TextInput,
} from '#components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import checkPermission from '#services/uiPermissions';
import { DataTableColumn } from '#components/shared/DataTable';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import { createFetchList } from '#hooks/useFetchData';
import { apiGetObjectTypes } from '#utils/apiUrls';

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
  sort: 'createdAt,desc',
  usageStatus: 1,
};

const ObjectTypeList: FC<TabContentProps> = ({ label, values }) => {
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);

  const { list, reset, pagination, status } = createFetchList(
    apiGetObjectTypes(),
    urlParams,
    false,
  );

  useEffect(() => {
    reset({ params: { ...filters } });
  }, [filters]);

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ maxWidth: '306px', width: '306px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search with Object Type`}
            onChange={debounce(
              ({ value }) => setFilters({ ...filters, displayName: value ? value : undefined }),
              500,
            )}
          />
        </div>
        {checkPermission(['ontology', 'createObjectType']) && (
          <Button
            id="create"
            onClick={() => {
              navigate('/ontology/object-types/add');
            }}
          >
            Add New Object Type
          </Button>
        )}
      </div>
      <LoadingContainer
        loading={status === 'loading'}
        component={
          <DataTable
            columns={[
              {
                id: 'name',
                label: 'Object Types',
                minWidth: 240,
                maxWidth: 800,
                format: function renderComp(item) {
                  return (
                    <span
                      className="primary"
                      onClick={() => {
                        navigate(`/ontology/${values.rootPath}/${item.id}`);
                      }}
                      title={item.displayName}
                    >
                      {item.displayName}
                    </span>
                  );
                },
              },
              ...(checkPermission(['ontology', 'editObjectType'])
                ? ([
                    {
                      id: 'actions',
                      label: 'Actions',
                      minWidth: 240,
                      align: 'center',
                      format: function renderComp(item) {
                        return (
                          <span
                            className="primary"
                            onClick={() => {
                              navigate(`/ontology/${values.rootPath}/edit/${item.id}`, {
                                state: { objectType: item },
                              });
                            }}
                          >
                            Edit
                          </span>
                        );
                      },
                    },
                  ] as DataTableColumn[])
                : []),
            ]}
            rows={list}
            emptyTitle="No Object Types Found"
          />
        }
      />
      <Pagination
        pageable={pagination}
        fetchData={(p) => reset({ params: { page: p.page, size: p.size } })}
      />
    </TabContentWrapper>
  );
};

export default ObjectTypeList;
