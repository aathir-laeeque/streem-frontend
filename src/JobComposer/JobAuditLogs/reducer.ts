import { Pageable } from '#utils/globalTypes';
import {
  JobAuditLogType,
  JobParameterAction,
  JobParameterActionType,
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

const reducer = (state = initialState, action: JobParameterActionType): JobAuditLogState => {
  switch (action.type) {
    case JobParameterAction.FETCH_JOB_PARAMETER_ONGOING:
      return { ...state, loading: true };

    case JobParameterAction.FETCH_JOB_PARAMETER_SUCCESS:
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

    case JobParameterAction.FETCH_JOB_PARAMETER_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as jobAuditLogsReducer };
