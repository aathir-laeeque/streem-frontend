import { Pageable } from '#utils/globalTypes';
import {
  JobAuditLogType,
  JobActivityAction,
  JobActivityActionType,
  JobAuditLogState,
} from './types';

export const initialState: JobAuditLogState = {
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
): JobAuditLogState => {
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
            ? (data as Array<JobAuditLogType>)
            : [...state.logs, ...(data as JobAuditLogType[])],
      };

    case JobActivityAction.FETCH_JOB_ACTIVITY_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as jobAuditLogsReducer };
