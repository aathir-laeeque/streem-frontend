import { Pageable } from '#utils/globalTypes';

import {
  SessionActivity,
  SessionActivityAction,
  SessionActivityActionType,
  SessionActivityState,
} from './types';

const initialState: SessionActivityState = {
  logs: [],
  loading: false,
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

const reducer = (
  state = initialState,
  action: SessionActivityActionType,
): SessionActivityState => {
  switch (action.type) {
    case SessionActivityAction.FETCH_SESSION_ACTIVITY_ONGOING:
      return { ...state, loading: true };

    case SessionActivityAction.FETCH_SESSION_ACTIVITY_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        pageable: pageable as Pageable,
        logs:
          pageable && pageable.page === 0
            ? (data as Array<SessionActivity>)
            : [...state.logs, ...(data as SessionActivity[])],
      };

    case SessionActivityAction.FETCH_SESSION_ACTIVITY_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as SessionActivityReducer };
