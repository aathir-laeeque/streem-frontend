import { Pageable } from '#utils/globalTypes';

import { Facility, Organisation } from '../commonTypes';
import {
  fetchMoreOngoing,
  fetchError,
  fetchOngoing,
  fetchSuccess,
  setSelectedStatus,
  setSelectedUser,
} from './actions';

export type UserRole = {
  id: number;
  name: string;
};

export enum UserStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

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
  roles?: UserRole[];
  facilities?: Facility[];
  organisation?: Organisation;
}

export type UsersById = Record<string, User>;

export type UserGroup = {
  readonly pageable: Pageable;
  readonly users: User[];
  readonly usersById: UsersById;
};

export type UsersState = {
  readonly error?: unknown;
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly selectedStatus: UserStatus;
  readonly selectedUserId?: User['id'];
  readonly [UserStatus.ACTIVE]: UserGroup;
  readonly [UserStatus.ARCHIVED]: UserGroup;
};

export enum UsersAction {
  FETCH_MORE_USERS_ONGOING = '@@users-service/FETCH_MORE_USERS_ONGOING',
  FETCH_USERS = '@@users-service/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users-service/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users-service/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users-service/FETCH_USERS_SUCCESS',

  SET_SELECTED_STATUS = '@@users-service/SET_SELECTED_STATUS',
  SET_SELECTED_USER = '@@users-service/SET_SELECTED_USER',
}

export type UsersActionType = ReturnType<
  | typeof fetchError
  | typeof fetchOngoing
  | typeof fetchMoreOngoing
  | typeof fetchSuccess
  | typeof setSelectedStatus
  | typeof setSelectedUser
>;

export type useUsersArgs = {
  status?: UserStatus;
  params?: fetchUsersParams;
};

export type useUsersReturnType = {
  loadMore: () => void;
  users: User[];
  usersById: UsersById;
};

export type fetchUsersParams = {
  filters: string;
  page: number;
  size: number;
  sort: string;
};

export type fetchArgs = {
  initialCall: boolean;
  params: fetchUsersParams;
  type: UserStatus;
};

export type fetchSuccessArgs = {
  data: {
    list: User[];
    pageable: Pageable;
  };
  type: UserStatus;
};
