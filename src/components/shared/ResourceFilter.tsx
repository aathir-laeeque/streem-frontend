import { NestedSelect, NestedSelectProps, PaginatedFetchData } from '#components';
import { useTypedSelector } from '#store';
import { apiGetObjects } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { fetchObjectTypes } from '#views/Ontology/actions';
import { Object } from '#views/Ontology/types';
import { ExpandMore } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const ResourceFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 0px 7.5px 12px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #bababa;
  color: #808ba5;

  :hover {
    border-bottom: 1px solid #005dcc;
  }

  .resource-filter-label {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .active {
    color: #000000;
  }

  .resource-filter-icons {
    display: flex;
    align-items: center;
    padding-inline: 4px 6px;
    border-left: 1px solid hsl(0, 0%, 90%);

    svg:nth-child(n) {
      height: 24px;
      width: 24px;
      &:hover {
        color: #101010;
      }
    }
  }
`;

export const ResourceFilter = ({ onChange, onClear }: any) => {
  const dispatch = useDispatch();
  const {
    ontology: {
      objectTypes: { list, listLoading, pageable: objectTypePagination },
    },
  } = useTypedSelector((state) => state);
  const [state, setState] = useState<{
    selectedResource?: Object;
    resourceOptions: NestedSelectProps['items'];
  }>({
    resourceOptions: {},
  });

  const { resourceOptions, selectedResource } = state;

  useEffect(() => {
    fetchResourcesData();
  }, []);

  useEffect(() => {
    if (list.length) {
      const listOptions = list.reduce<any>((acc, item) => {
        acc[item.id] = {
          label: item.displayName,
          fetchItems: async (pageNumber?: number, query = '') => {
            if (typeof pageNumber === 'number') {
              try {
                const { data: resData, pageable }: ResponseObj<any[]> = await request(
                  'GET',
                  apiGetObjects(),
                  {
                    params: {
                      page: pageNumber + 1,
                      size: DEFAULT_PAGE_SIZE,
                      collection: item.externalId,
                      filters: JSON.stringify({
                        op: FilterOperators.AND,
                        fields: [
                          ...(query
                            ? [{ field: 'displayName', op: FilterOperators.LIKE, values: [query] }]
                            : []),
                        ],
                      }),
                      usageStatus: 1,
                    },
                  },
                );
                if (resData && pageable) {
                  return {
                    options: resData.map((item) => ({
                      ...item,
                      value: item.id,
                      label: item.displayName,
                    })),
                    pageable,
                  };
                }
              } catch (e) {
                console.error('Error while fetching existing unmapped parameters', e);
              }
            }
            return {
              options: [],
            };
          },
        };
        return acc;
      }, {});
      setState((prev) => ({ ...prev, resourceOptions: listOptions }));
    }
  }, [list]);

  const fetchResourcesData = (params: PaginatedFetchData = {}) => {
    const { page = DEFAULT_PAGE_NUMBER, size = 250 } = params;

    dispatch(
      fetchObjectTypes(
        {
          page,
          size,
          usageStatus: 1,
        },
        true,
      ),
    );
  };

  const ResourceFilterLabel = () => {
    return (
      <ResourceFilterWrapper>
        <div
          className={
            selectedResource?.id ? 'resource-filter-label active' : 'resource-filter-label'
          }
        >
          {selectedResource?.displayName || `Resource Filter`}
        </div>
        <div className="resource-filter-icons">
          {selectedResource?.id && <ClearIcon onMouseDown={onClearAll} />}
          {listLoading && <MoreHorizIcon />}
          <ExpandMore />
        </div>
      </ResourceFilterWrapper>
    );
  };

  const onChildChange = (option: any) => {
    setState((prev) => ({ ...prev, selectedResource: option }));
    onChange(option);
  };

  const onClearAll = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setState((prev) => ({ ...prev, selectedResource: undefined }));
    onClear();
  };

  return (
    <NestedSelect
      id="resource-filter-selector"
      width="200px"
      label={ResourceFilterLabel}
      items={resourceOptions}
      onChildChange={onChildChange}
      pagination={objectTypePagination}
      fetchData={fetchResourcesData}
      maxHeight={350}
    />
  );
};