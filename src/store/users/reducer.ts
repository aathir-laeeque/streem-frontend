import {
  User,
  UsersAction,
  UsersActionType,
  UsersState,
  UserState,
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
  selectedState: UserState.ACTIVE,
  selectedUser: undefined,
  error: undefined,
  currentPageData: [],
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
              ? (data as User[])
              : [...state[type].list, ...(data as User[])],
        },
        currentPageData: data as User[],
      };

    case UsersAction.SET_SELECTED_STATE:
      return {
        ...state,
        selectedState: action.payload?.state || state.selectedState,
      };

    case UsersAction.SET_SELECTED_USER:
      return {
        ...state,
        selectedUserId: action.payload.id,
        selectedUser: undefined,
      };

    case UsersAction.FETCH_SELECTED_USER_SUCCESS:
      return {
        ...state,
        selectedUser: action.payload.data,
      };

    case UsersAction.FETCH_USERS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as UsersReducer };
