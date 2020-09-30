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
  assigned?: boolean;
  completelyAssigned?: boolean;
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

export type UsersGroup = {
  list: User[];
  pageable: Pageable;
};

export interface UsersState {
  readonly [UserStatus.ACTIVE]: UsersGroup;
  readonly [UserStatus.ARCHIVED]: UsersGroup;
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
  FETCH_USERS = '@@users-copy/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users-copy/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users-copy/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users-copy/FETCH_USERS_SUCCESS',
  SET_SELECTED_STATUS = '@@users-copy/SET_SELECTED_STATUS',
  SET_SELECTED_USER = '@@users-copy/SET_SELECTED_USER',
}

export type UsersActionType = ReturnType<
  | typeof fetchUsersError
  | typeof fetchUsersSuccess
  | typeof setSelectedStatus
  | typeof fetchUsersOngoing
  | typeof fetchUsers
  | typeof setSelectedUser
>;
