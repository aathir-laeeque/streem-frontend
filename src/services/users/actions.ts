import { actionSpreader } from '#store/helpers';

import {
  fetchArgs,
  fetchSuccessArgs,
  User,
  UsersAction,
  UserState,
} from './types';

export const fetch = ({ initialCall, params, type }: fetchArgs) =>
  actionSpreader(UsersAction.FETCH_USERS, { params, type, initialCall });

export const fetchOngoing = () =>
  actionSpreader(UsersAction.FETCH_USERS_ONGOING);

export const fetchMoreOngoing = () =>
  actionSpreader(UsersAction.FETCH_MORE_USERS_ONGOING);

export const fetchSuccess = ({
  data: { list, pageable },
  type,
}: fetchSuccessArgs) =>
  actionSpreader(UsersAction.FETCH_USERS_SUCCESS, { list, pageable, type });

export const fetchError = (error: unknown) =>
  actionSpreader(UsersAction.FETCH_USERS_ERROR, { error });

export const setSelectedState = (state: UserState) =>
  actionSpreader(UsersAction.SET_SELECTED_STATE, { state });

export const setSelectedUser = (userId: User['id']) =>
  actionSpreader(UsersAction.SET_SELECTED_USER, { userId });
