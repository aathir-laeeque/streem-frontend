import { useTypedSelector } from '#store/helpers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetch } from './actions';
import { fetchParams, UserStatus, useUsersArgs } from './types';

const defaultParams: fetchParams = {
  filters: JSON.stringify({
    op: 'AND',
    fields: [{ field: 'isArchived', op: 'EQ', values: [false] }],
  }),
  page: 0,
  size: 10,
  sort: 'createdAt,desc',
};

const useUsers = ({
  status = UserStatus.ACTIVE,
  params = defaultParams,
}: useUsersArgs) => {
  const { pageable, users, usersById } = useTypedSelector(
    (state) => state.usersService[status],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) {
      dispatch(fetch({ initialCall: true, params, type: status }));
    }
  }, []);

  const loadMore = () => {
    if (!pageable.last) {
      dispatch(
        fetch({
          initialCall: false,
          type: status,
          params: {
            filters: params.filters,
            page: pageable.page + 1,
            size: pageable.pageSize,
            sort: params.sort,
          },
        }),
      );
    }
  };

  return { loadMore, users, usersById };
};

export { defaultParams, useUsers };
