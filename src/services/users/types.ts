import { Pageable } from '#utils/globalTypes';

import { Facility, Organisation } from '../commonTypes';
import {
  fetchMoreOngoing,
  fetchError,
  fetchOngoing,
  fetchSuccess,
  setSelectedState,
  setSelectedUser,
} from './actions';

export type UserRole = {
  id: number;
  name: string;
};

export enum UserState {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum OtherUserState {
  TASKS = 'tasks',
  REVIEWERS = 'reviewers',
  AUTHORS = 'authors',
}

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
  roles?: UserRole[];
  facilities?: Facility[];
  organisation?: Organisation;
}

export type UsersById = Record<User['id'], User>;

export type UserGroup = {
  readonly pageable: Pageable;
  readonly users: User[];
  readonly usersById: UsersById;
};

export type UsersState = {
  readonly error?: unknown;
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly selectedState: UserState;
  readonly selectedUserId?: User['id'];
  readonly [UserState.ACTIVE]: UserGroup;
  readonly [UserState.ARCHIVED]: UserGroup;
  readonly [OtherUserState.TASKS]: UserGroup;
  readonly [OtherUserState.REVIEWERS]: UserGroup;
  readonly [OtherUserState.AUTHORS]: UserGroup;
};

export enum UsersAction {
  FETCH_MORE_USERS_ONGOING = '@@users-service/FETCH_MORE_USERS_ONGOING',
  FETCH_USERS = '@@users-service/FETCH_USERS',
  FETCH_USERS_ERROR = '@@users-service/FETCH_USERS_ERROR',
  FETCH_USERS_ONGOING = '@@users-service/FETCH_USERS_ONGOING',
  FETCH_USERS_SUCCESS = '@@users-service/FETCH_USERS_SUCCESS',

  SET_SELECTED_STATE = '@@users-service/SET_SELECTED_STATE',
  SET_SELECTED_USER = '@@users-service/SET_SELECTED_USER',
}

export type UsersActionType = ReturnType<
  | typeof fetchError
  | typeof fetchOngoing
  | typeof fetchMoreOngoing
  | typeof fetchSuccess
  | typeof setSelectedState
  | typeof setSelectedUser
>;

export type useUsersArgs = {
  userState?: UserState | OtherUserState;
  params?: fetchUsersParams;
};

export type useUsersReturnType = {
  loadMore: () => void;
  loadAgain: ({ newParams }: { newParams: fetchUsersParams }) => void;
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
  type: UserState | OtherUserState;
};

export type fetchSuccessArgs = {
  data: {
    list: User[];
    pageable: Pageable;
  };
  type: UserState | OtherUserState;
  initialCall: boolean;
};
