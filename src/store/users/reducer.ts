import { UsersAction, UsersActionType, UsersState, UserStatus } from './types';
import { initialTabState } from '#components/shared/useTabs';

const initialState: UsersState = {
  users: {
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
  },
  loading: true,
  selectedStatus: UserStatus.ACTIVE,
  selectedUser: undefined,
  error: undefined,
};

const reducer = (state = initialState, action: UsersActionType): UsersState => {
  const { users, selectedStatus } = state;
  switch (action.type) {
    case UsersAction.FETCH_USERS_ONGOING:
      return { ...state, loading: true };
    case UsersAction.FETCH_USERS_SUCCESS:
      const { data, pageable, type } = action.payload;
      if (data && type && pageable) {
        const oldList = pageable?.page === 0 ? [] : users[type].list;
        users[type].list = [...oldList, ...data];
        users[type].pageable = pageable;
      }
      return {
        ...state,
        loading: false,
        users,
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
