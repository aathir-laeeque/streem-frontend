import { UsersAction, UsersActionType, UsersState } from './types';

const initialState: UsersState = {
  list: undefined,
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
  error: undefined,
};

const reducer = (state = initialState, action: UsersActionType): UsersState => {
  switch (action.type) {
    case UsersAction.FETCH_USERS_SUCCESS:
      if (action.payload?.data && action.payload?.pageable) {
        const { data, pageable } = action.payload;
        let { list } = state;
        const oldList = pageable?.page === 0 ? [] : list || [];
        list = [...oldList, ...data];
        return {
          ...state,
          list,
          pageable,
        };
      }
    case UsersAction.FETCH_USERS_ERROR:
      return { ...state, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as UsersReducer };
