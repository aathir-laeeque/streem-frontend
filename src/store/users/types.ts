import { Facility, Organisation } from '#services/commonTypes';
import { Pageable } from '#utils/globalTypes';
import { RoleType } from '#views/UserAccess/types';

import {
  fetchUsers,
  fetchUsersError,
  fetchUsersOngoing,
  fetchUsersSuccess,
  setSelectedState,
  setSelectedUser,
  fetchSelectedUser,
  fetchSelectedUserSuccess,
} from './actions';

export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verified: boolean;
  blocked: boolean;
  archived: boolean;
  active: boolean;
  department?: string;
  assigned?: boolean;
  completelyAssigned?: boolean;
  roles?: Pick<RoleType, 'id' | 'name'>[];
  facilities?: Facility[];
  organisation?: Organisation;
}

export type Users = User[];

export interface ParsedUser extends User {
  properties: Record<string, string>;
}

export type UsersGroup = {
  list: User[];
  pageable: Pageable;
};

export interface UsersState {
  readonly [UserState.ACTIVE]: UsersGroup;
  readonly [UserState.ARCHIVED]: UsersGroup;
  readonly loading: boolean;
  readonly error?: string;
  readonly selectedState: string;
  readonly selectedUser?: User;
  readonly selectedUserId?: User['id'];
  readonly currentPageData: User[];
}

export enum UserState {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum UsersAction {
  FETCH_USERS = '@@users/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users/FETCH_USERS_SUCCESS',
  SET_SELECTED_STATE = '@@users/SET_SELECTED_STATE',
  SET_SELECTED_USER = '@@users/SET_SELECTED_USER',
  FETCH_SELECTED_USER = '@@users/FETCH_SELECTED_USER',
  FETCH_SELECTED_USER_SUCCESS = '@@users/FETCH_SELECTED_USER_SUCCESS',
  FETCH_SELECTED_USER_ERROR = '@@users/FETCH_SELECTED_USER_ERROR',
}

export type UsersActionType = ReturnType<
  | typeof fetchUsersError
  | typeof fetchUsersSuccess
  | typeof setSelectedState
  | typeof fetchUsersOngoing
  | typeof fetchUsers
  | typeof setSelectedUser
  | typeof fetchSelectedUser
  | typeof fetchSelectedUserSuccess
>;
