import { DEFAULT_PAGINATION } from '#utils/constants';
import { Pageable } from '#utils/globalTypes';
import {
  JobAuditLogState,
  JobAuditLogType,
  JobParameterAction,
  JobParameterActionType,
} from './types';

export const initialState: JobAuditLogState = {
  logs: [],
  loading: false,
  pageable: DEFAULT_PAGINATION,
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
