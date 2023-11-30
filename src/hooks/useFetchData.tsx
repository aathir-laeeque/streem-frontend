import { DEFAULT_PAGINATION } from '#utils/constants';
import {
  FilterField,
  FilterOperators,
  Pageable,
  ResponseError,
  ResponseObj,
} from '#utils/globalTypes';
import { request } from '#utils/request';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';

interface CreateFetchListHookState<T> {
  url: string;
  pagination: Pageable;
  status?: 'init' | 'loading' | 'loadingNext' | 'success' | 'error';
  list?: T[];
  listById?: Record<string, T>;
  errors?: ResponseError[];
  params: CreateFetchListHookProps;
  pagesFetched: Record<number, string>;
}

type CreateFetchListHookProps = {
  page?: number | string | null;
  size?: number;
  sort?: string;
  filters?: {
    op?: FilterOperators;
    fields: FilterField[];
  };
} & Record<string, any>;

export function createFetchList<T>(
  _url: string,
  _params: CreateFetchListHookProps = {},
  shouldPreload = true,
) {
  const [state, setState] = useState<CreateFetchListHookState<T>>({
    url: _url,
    status: 'init',
    pagination: DEFAULT_PAGINATION,
    pagesFetched: {},
    params: _params,
  });

  const { list, errors, status, pagination, params, listById, url } = state;
  const { last, page, pageSize } = pagination;

  useEffect(() => {
    if (shouldPreload) {
      setState((prev) => ({ ...prev, status: 'loading' }));
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (status !== 'init') fetchData();
  }, [params]);

  const fetchData = async () => {
    const queryParams = {
      page,
      size: pageSize,
      ...params,
    };
    const urlString = url + JSON.stringify(queryParams);
    if (url) {
      const response: ResponseObj<T[]> = await request('GET', url, {
        params: queryParams,
      });
      const { data, errors: _errors, pageable } = response || {};
      if (data) {
        setState((prev) => ({
          ...prev,
          status: 'success',
          list: [...(prev.list ?? []), ...data],
          listById: { ...prev?.listById, ...keyBy(data, 'id') },
          pagination: pageable || DEFAULT_PAGINATION,
          pagesFetched: { ...prev.pagesFetched, [page]: urlString },
        }));
      } else {
        setState((prev) => ({ ...prev, status: 'error', errors: _errors }));
      }
    } else {
      setState((prev) => ({ ...prev, status: 'success' }));
    }
  };

  const fetchNext = async () => {
    if (!last && !['loadingNext', 'loading'].includes(status!)) {
      setState((prev) => ({
        ...prev,
        status: 'loadingNext',
        params: { ...prev.params, page: prev.pagination.page + 1 },
        pagination: {
          ...prev.pagination,
          page: prev.pagination.page + 1,
        },
      }));
    }
  };

  const getCurrentPageData = () => {
    const initialIndex = page * pageSize;
    return list?.slice(initialIndex, initialIndex + pageSize);
  };

  const reset = (_params: { url?: string; params?: CreateFetchListHookProps }) => {
    const { url = '', params = {} } = _params;
    setState((prev) => {
      return {
        ...prev,
        url: url || prev.url,
        params: {
          ...prev.params,
          ...params,
          filters: {
            ...prev.params.filters,
            fields: params?.filters?.fields,
          },
        },
        status: 'loading',
        pagination: DEFAULT_PAGINATION,
        list: undefined,
        listById: {},
      };
    });
  };

  return {
    list: list ?? [],
    listById: listById ?? {},
    getCurrentPageData,
    errors,
    pagination,
    status,
    fetchNext,
    reset,
    fetch: reset,
    filters: params?.filters?.fields ?? [],
  };
}
