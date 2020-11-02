import { Pageable } from '#utils/globalTypes';

import {
  fetchUsers,
  fetchUsersError,
  fetchUsersOngoing,
  fetchUsersSuccess,
  setSelectedState,
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
  readonly [UserState.ACTIVE]: UsersGroup;
  readonly [UserState.ARCHIVED]: UsersGroup;
  readonly loading: boolean;
  readonly error: any;
  readonly selectedState: string;
  readonly selectedUser: undefined | User;
}

export enum UserState {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum UsersAction {
  FETCH_USERS = '@@users-copy/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users-copy/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users-copy/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users-copy/FETCH_USERS_SUCCESS',
  SET_SELECTED_STATE = '@@users-copy/SET_SELECTED_STATE',
  SET_SELECTED_USER = '@@users-copy/SET_SELECTED_USER',
}

export type UsersActionType = ReturnType<
  | typeof fetchUsersError
  | typeof fetchUsersSuccess
  | typeof setSelectedState
  | typeof fetchUsersOngoing
  | typeof fetchUsers
  | typeof setSelectedUser
>;
