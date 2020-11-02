import { Reducer } from 'redux';

import {
  UserGroup,
  UsersAction,
  UsersActionType,
  UsersById,
  UsersState,
  UserState,
} from './types';

const initialUserGroup: UserGroup = {
  pageable: {
    page: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  },
  users: [],
  usersById: {},
};

const initalState: UsersState = {
  loading: false,
  loadingMore: false,
  selectedState: UserState.ACTIVE,
  [UserState.ACTIVE]: initialUserGroup,
  [UserState.ARCHIVED]: initialUserGroup,
};

const reducer: Reducer<UsersState, UsersActionType> = (
  state = initalState,
  action,
) => {
  switch (action.type) {
    case UsersAction.FETCH_USERS_ONGOING:
      return { ...state, loading: true };

    case UsersAction.FETCH_USERS_ERROR:
      return { ...state, error: action.payload.error };

    case UsersAction.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        [action.payload.type]: {
          ...state[action.payload.type],
          pageable: action.payload.pageable,
          users: [...state[action.payload.type].users, ...action.payload.list],
          usersById: {
            ...state[action.payload.type].usersById,
            ...action.payload.list.reduce<UsersById>((acc, user) => {
              acc[user.id] = user;
              return acc;
            }, {}),
          },
        },
      };

    case UsersAction.FETCH_MORE_USERS_ONGOING:
      return { ...state, loadingMore: true };

    case UsersAction.SET_SELECTED_STATE:
      return { ...state, selectedState: action.payload.state };

    case UsersAction.SET_SELECTED_USER:
      return { ...state, selectedUserId: action.payload.userId };

    default:
      return { ...state };
  }
};

export { reducer as UsersServiceReducer };
