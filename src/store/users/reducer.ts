import { UsersAction, UsersActionType, UsersState, UserStatus } from './types';

const initialTabState = {
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
};

const initialState: UsersState = {
  users: {
    active: initialTabState,
    archived: initialTabState,
  },
  loading: false,
  selectedStatus: UserStatus.ACTIVE,
  selectedUser: undefined,
  error: undefined,
};

const reducer = (state = initialState, action: UsersActionType): UsersState => {
  switch (action.type) {
    case UsersAction.FETCH_USERS_ONGOING:
      return { ...state, loading: true };

    case UsersAction.FETCH_USERS_SUCCESS:
      const { data, pageable, type } = action.payload;
      if (data && type && pageable) {
        return {
          ...state,
          loading: false,
          users: {
            ...state.users,
            [type]: {
              list:
                pageable?.page === 0
                  ? data
                  : [...state.users[type].list, ...data],
              pageable,
            },
          },
        };
      }
      return { ...state };

    case UsersAction.SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.payload?.status || state.selectedStatus,
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
