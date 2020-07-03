import { Pageable } from '#utils/globalTypes';

import {
  fetchUsers,
  fetchUsersError,
  fetchUsersOngoing,
  fetchUsersSuccess,
} from './actions';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export type Users = User[];
export interface UsersState {
  readonly list: Users | undefined;
  readonly pageable: Pageable | undefined | null;
  readonly error: any;
}

export enum UsersAction {
  FETCH_USERS = '@@users/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users/FETCH_USERS_SUCCESS',
}

export type UsersActionType = ReturnType<
  | typeof fetchUsers
  | typeof fetchUsersError
  | typeof fetchUsersOngoing
  | typeof fetchUsersSuccess
>;
