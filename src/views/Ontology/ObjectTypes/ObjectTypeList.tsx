import {
  DataTable,
  LoadingContainer,
  PaginatedFetchData,
  Pagination,
  TabContentProps,
} from '#components';
import { useTypedSelector } from '#store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { navigate } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObjectTypes } from '../actions';

const ObjectTypeList: FC<TabContentProps> = ({ label, values }) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading, pageable },
  } = useTypedSelector((state) => state.ontology);

  const fetchData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = DEFAULT_PAGE_SIZE } = params;
    dispatch(
      fetchObjectTypes({
        page,
        size,
        usageStatus: 1,
      }),
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <TabContentWrapper>
      <LoadingContainer
        loading={listLoading}
        component={
          <DataTable
            columns={[
              {
                id: 'name',
                label: 'Object Types',
                minWidth: 240,
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
