import { NestedSelect, NestedSelectProps } from '#components';
import { createFetchList } from '#hooks/useFetchData';
import { apiGetObjectTypes } from '#utils/apiUrls';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';
import { FilterOperators, fetchDataParams } from '#utils/globalTypes';
import { Object } from '#views/Ontology/types';
import { getObjectPartialCall } from '#views/Ontology/utils';
import { ExpandMore } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ResourceFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 0px 7.5px 12px;
  border: 1px solid #bababa;
  color: #808ba5;

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
  const [state, setState] = useState<{
    selectedResource?: Object;
    resourceOptions: NestedSelectProps['items'];
  }>({
    resourceOptions: {},
  });

  const {
    list,
    reset,
    pagination: objectTypePagination,
    status,
    fetchNext,
  } = createFetchList(
    apiGetObjectTypes(),
    {
      usageStatus: 1,
    },
    false,
  );

  const { resourceOptions, selectedResource } = state;

  useEffect(() => {
    if (list.length) {
      const listOptions = list.reduce<any>((acc, item) => {
        acc[item.id] = {
          label: item.displayName,
          fetchItems: async (pageNumber?: number, query = '') => {
            if (typeof pageNumber === 'number') {
              const { data: resData, pageable } = await getObjectPartialCall({
                page: pageNumber,
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
              });
              return {
                options: resData.map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.displayName,
                })),
                pageable,
              };
            }
            return {
              options: [],
            };
          },
        };
        return acc;
      }, {});
      setState((prev) => ({ ...prev, resourceOptions: listOptions }));
    } else {
      setState((prev) => ({
        ...prev,
        resourceOptions: { 'no-options': { label: 'No Options', options: [] } },
      }));
    }
  }, [list]);

  const fetchResourcesData = (params: fetchDataParams = {}) => {
    const { query, page = DEFAULT_PAGE_NUMBER, ...rest } = params;
    if (page > 0) {
      fetchNext();
    } else {
      reset({ params: { ...rest, displayName: query, usageStatus: 1, page } });
    }
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
          {status === 'loading' && <MoreHorizIcon />}
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
      popOutProps={{ filterOption: () => true }}
      onChildChange={onChildChange}
      pagination={objectTypePagination}
      fetchData={fetchResourcesData}
      maxHeight={350}
    />
  );
};
