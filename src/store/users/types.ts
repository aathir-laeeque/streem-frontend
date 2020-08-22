import { Pageable } from '#utils/globalTypes';

import {
  fetchUsers,
  fetchUsersError,
  fetchUsersOngoing,
  fetchUsersSuccess,
  setSelectedStatus,
  setSelectedUser,
} from './actions';

export interface User {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verified: boolean;
  archived: boolean;
  active: boolean;
  department?: string;
  roles?: {
    id: number;
    name: string;
  }[];
  facilities?: {
    id: number;
    name: string;
  }[];
  organisation?: {
    id: number;
    name: string;
  };
}

export type Users = User[];

export type UsersGroup = Record<
  string,
  {
    list: Users | [];
    pageable: Pageable;
  }
>;
export interface UsersState {
  readonly users: UsersGroup;
  readonly loading: boolean;
  readonly error: any;
  readonly selectedStatus: string;
  readonly selectedUser: undefined | User;
}

export enum UserStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum UsersAction {
  FETCH_USERS = '@@users/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users/FETCH_USERS_SUCCESS',
  SET_SELECTED_STATUS = '@@users/SET_SELECTED_STATUS',
  SET_SELECTED_USER = '@@users/SET_SELECTED_USER',
}

export type UsersActionType = ReturnType<
  | typeof fetchUsersError
  | typeof fetchUsersSuccess
  | typeof setSelectedStatus
  | typeof fetchUsersOngoing
  | typeof fetchUsers
  | typeof setSelectedUser
>;
