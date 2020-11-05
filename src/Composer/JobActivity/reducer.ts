import { Pageable } from '#utils/globalTypes';
import {
  JobActivity,
  JobActivityAction,
  JobActivityActionType,
  JobActivityState,
} from './types';

export const initialState: JobActivityState = {
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
  action: JobActivityActionType,
): JobActivityState => {
  switch (action.type) {
    case JobActivityAction.FETCH_JOB_ACTIVITY_ONGOING:
      return { ...state, loading: true };

    case JobActivityAction.FETCH_JOB_ACTIVITY_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        pageable: pageable as Pageable,
        logs:
          pageable && pageable.page === 0
            ? (data as Array<JobActivity>)
            : [...state.logs, ...(data as JobActivity[])],
      };

    case JobActivityAction.FETCH_JOB_ACTIVITY_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as jobActivityReducer };
