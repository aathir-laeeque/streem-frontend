import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { User, UsersAction } from './types';

export const fetchUsers = (
  params: Record<string, string | number>,
  type: string,
) => actionSpreader(UsersAction.FETCH_USERS, { params, type });

export const fetchUsersOngoing = () =>
  actionSpreader(UsersAction.FETCH_USERS_ONGOING);

export const fetchUsersSuccess = (
  { data, pageable }: Partial<ResponseObj<User>>,
  type: string,
) =>
  actionSpreader(UsersAction.FETCH_USERS_SUCCESS, {
    data,
    pageable,
    type,
  });

export const fetchUsersError = (error: any) =>
  actionSpreader(UsersAction.FETCH_USERS_ERROR, { error });

export const setSelectedStatus = (status: string) =>
  actionSpreader(UsersAction.SET_SELECTED_STATUS, { status });

export const setSelectedUser = (user: User) =>
  actionSpreader(UsersAction.SET_SELECTED_USER, user);
