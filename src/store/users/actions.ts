import { Pageable } from '#views/Checklists/types';

import { actionSpreader } from '../helpers';
import { Users, UsersAction } from './types';

export const fetchUsers = (params: Record<string, string>) =>
  actionSpreader(UsersAction.FETCH_USERS, params);

export const fetchUsersOngoing = () =>
  actionSpreader(UsersAction.FETCH_USERS_ONGOING);

export const fetchUsersSuccess = (users: Users, pageable: Pageable) =>
  actionSpreader(UsersAction.FETCH_USERS_SUCCESS, {
    users,
    pageable,
  });

export const fetchUsersError = (error: any) =>
  actionSpreader(UsersAction.FETCH_USERS_ERROR, { error });
