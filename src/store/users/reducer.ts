import {
  User,
  UsersAction,
  UsersActionType,
  UsersState,
  UserStatus,
} from '#store/users/types';

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
  active: initialTabState,
  archived: initialTabState,
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

      return {
        ...state,
        loading: false,
        [type]: {
          pageable,
          list:
            pageable && pageable.page === 0
              ? (data as Array<User>)
              : [...state[type].list, ...(data as Array<User>)],
        },
      };

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
