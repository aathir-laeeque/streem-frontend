import { DataTable, TabContentProps } from '#components';
import { useTypedSelector } from '#store';
import { FilterField, FilterOperators } from '#utils/globalTypes';
import { TabContentWrapper } from '#views/Jobs/NewListView/styles';
import { CircularProgress, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { navigate } from '@reach/router';
import React, { FC, useState, MouseEvent, useEffect } from 'react';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

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
              {
                id: 'actions',
                label: 'Actions',
                minWidth: 100,
                format: function renderComp(item) {
                  return (
                    <>
                      <div
                        id="more-actions"
                        onClick={(event: MouseEvent<HTMLDivElement>) => {
                          setAnchorEl(event.currentTarget);
                        }}
                      >
                        More <ArrowDropDown className="icon" />
                      </div>
                      <Menu
                        id="row-more-actions"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        style={{ marginTop: 40 }}
                      >
                        <MenuItem>
                          <div className="list-item">Item 1</div>
                        </MenuItem>
                        <MenuItem>
                          <div className="list-item">Item 2</div>
                        </MenuItem>
                        <MenuItem>
                          <div className="list-item">Item 3</div>
                        </MenuItem>
                      </Menu>
                    </>
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
