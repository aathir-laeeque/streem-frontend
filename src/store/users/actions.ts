import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { User, UsersAction } from './types';

export const fetchUsers = (params: Record<string, string>) =>
  actionSpreader(UsersAction.FETCH_USERS, params);

export const fetchUsersOngoing = () =>
  actionSpreader(UsersAction.FETCH_USERS_ONGOING);

export const fetchUsersSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<User>>) =>
  actionSpreader(UsersAction.FETCH_USERS_SUCCESS, {
    data,
    pageable,
  });

export const fetchUsersError = (error: any) =>
  actionSpreader(UsersAction.FETCH_USERS_ERROR, { error });
