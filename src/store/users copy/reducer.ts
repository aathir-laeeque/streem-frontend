import {
  UsersAction,
  UsersActionType,
  UsersState,
  UserState,
  User,
} from './types';

const initialState: UsersState = {
  active: {
    list: [],
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
  },
  archived: {
    list: [],
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
  },
  loading: true,
  selectedState: UserState.ACTIVE,
  selectedUser: undefined,
  error: undefined,
};

const reducer = (state = initialState, action: UsersActionType): UsersState => {
  switch (action.type) {
    case UsersAction.FETCH_USERS_ONGOING:
      return { ...state, loading: true };

    case UsersAction.FETCH_USERS_SUCCESS:
      const { data, pageable, type } = action.payload;

      return {
        ...state,
        loading: false,
        [type]: {
          pageable,
          list: [...state[type].list, ...(data as Array<User>)],
        },
      };

    case UsersAction.SET_SELECTED_STATE:
      return {
        ...state,
        selectedState: action.payload?.state || state.selectedState,
      };

    case UsersAction.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };

    case UsersAction.FETCH_USERS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as UsersReducer };
