import {
  fetchUsers,
  fetchUsersError,
  fetchUsersOngoing,
  fetchUsersSuccess,
} from './actions';
import { Pageable } from '#views/Checklists/types';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export type Users = User[];

export interface UsersObj {
  object: string;
  status: string;
  message: string;
  data: User[];
  pageable: Pageable;
  errors?: any;
}

export interface UsersState {
  readonly list: Users | undefined;
  readonly pageable: Pageable | undefined;
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
