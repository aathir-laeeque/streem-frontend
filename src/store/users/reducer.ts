import { UsersAction, UsersActionType, UsersState } from './types';

const initialState: UsersState = {
  list: undefined,
  pageable: undefined,
  error: undefined,
};

const reducer = (state = initialState, action: UsersActionType): UsersState => {
  switch (action.type) {
    case UsersAction.FETCH_USERS_SUCCESS:
      return {
        ...state,
        list: action.payload?.data,
        pageable: action.payload?.pageable,
      };
    case UsersAction.FETCH_USERS_ERROR:
      return { ...state, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as UsersReducer };
