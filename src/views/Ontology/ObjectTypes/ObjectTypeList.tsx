import {
  Button,
  DataTable,
  LoadingContainer,
  Pagination,
  TabContentProps,
  TextInput,
} from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { fetchDataParams } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { navigate } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObjectTypes } from '../actions';
import checkPermission from '#services/uiPermissions';
import { DataTableColumn } from '#components/shared/DataTable';
import { Search } from '@material-ui/icons';
import { debounce } from 'lodash';

const ObjectTypeList: FC<TabContentProps> = ({ label, values }) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading, pageable },
  } = useTypedSelector((state) => state.ontology);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = (params: fetchDataParams = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchObjectTypes({
        page,
        size,
        usageStatus: 1,
        displayName: searchQuery ? searchQuery : undefined,
      }),
    );
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <TabContentWrapper>
      <div className="filters">
        <div style={{ maxWidth: '306px', width: '306px' }}>
          <TextInput
            afterElementWithoutError
            AfterElement={Search}
            afterElementClass=""
            placeholder={`Search with Object Type`}
            onChange={debounce(({ value }) => setSearchQuery(value), 500)}
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
        loading={listLoading}
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
                              navigate(`/ontology/${values.rootPath}/edit/${item.id}`);
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
          />
        }
      />
      <Pagination pageable={pageable} fetchData={fetchData} />
    </TabContentWrapper>
  );
};

export default ObjectTypeList;
