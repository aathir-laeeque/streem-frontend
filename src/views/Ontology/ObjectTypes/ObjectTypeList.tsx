import {
  Button,
  DataTable,
  LoadingContainer,
  Pagination,
  TabContentProps,
  TextInput,
} from '#components';
import { DataTableColumn } from '#components/shared/DataTable';
import { createFetchList } from '#hooks/useFetchData';
import checkPermission from '#services/uiPermissions';
import { apiGetObjectTypes } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { Search } from '@material-ui/icons';
import { navigate, useLocation } from '@reach/router';
import { debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

const urlParams = {
  page: DEFAULT_PAGE_NUMBER,
  size: DEFAULT_PAGE_SIZE,
  usageStatus: 1,
};

const ObjectTypeList: FC<TabContentProps> = ({ values }) => {
  const [filters, setFilters] = useState<Record<string, any>>(urlParams);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  const { list, reset, pagination, status } = createFetchList(
    apiGetObjectTypes(),
    urlParams,
    false,
  );

  useEffect(() => {
    reset({ params: { ...filters, page } });
  }, [filters, page]);

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
      <Pagination pageable={pagination} fetchData={true} />
    </TabContentWrapper>
  );
};

export default ObjectTypeList;
