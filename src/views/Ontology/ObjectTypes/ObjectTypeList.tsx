import { DataTable, TabContentProps } from '#components';
import { useTypedSelector } from '#store';
import { FilterField } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/ListView/styles';
import { CircularProgress } from '@material-ui/core';
import { navigate } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchObjectTypes } from '../actions';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 100;

export const LoadingContainer = ({
  loading,
  component,
}: {
  loading: boolean;
  component?: JSX.Element;
}) => {
  return loading ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <CircularProgress style={{ color: 'rgb(29, 132, 255)' }} />
    </div>
  ) : (
    component || <></>
  );
};

const ObjectTypeList: FC<TabContentProps> = ({ label, values }) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { list, listLoading },
  } = useTypedSelector((state) => state.ontology);

  const fetchData = (
    page = DEFAULT_PAGE_NUMBER,
    size = DEFAULT_PAGE_SIZE,
    filtersArr?: FilterField[],
  ) => {
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
    </TabContentWrapper>
  );
};

export default ObjectTypeList;
