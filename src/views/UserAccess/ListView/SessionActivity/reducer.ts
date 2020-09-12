import {
  SessionActivityAction,
  SessionActivityActionType,
  SessionActivityState,
} from './types';

const initialState: SessionActivityState = {
  logs: undefined,
  loading: true,
  error: undefined,
  pageable: {
    page: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: false,
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
      let { logs } = state;
      if (data && pageable) {
        const oldList = pageable.page !== 0 ? (logs ? logs : []) : [];
        logs = [...oldList, ...data];
      }
      return {
        ...state,
        loading: false,
        logs,
        pageable,
      };

    case SessionActivityAction.FETCH_SESSION_ACTIVITY_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as SessionActivityReducer };
