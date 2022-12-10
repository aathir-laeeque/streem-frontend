import { Pageable } from '#utils/globalTypes';
import { ReportState, ReportsAction, ReportsList } from './types';

const initialState = {
  loading: false,
  error: undefined,
  selectedState: ReportState.Reports,
  reports: {
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
  report: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ReportsAction.FETCH_REPORTS:
      return { ...state, loading: true };
    case ReportsAction.FETCH_REPORTS_ONGOING:
      return { ...state, loading: true };

    case ReportsAction.FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: {
          ...state.reports,
          list: action.payload.data as Array<ReportsList>,
          pageable: action.payload.pageable as Pageable,
        },
      };

    case ReportsAction.FETCH_REPORTS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    case ReportsAction.FETCH_REPORT:
      return { ...state, loading: true };
    case ReportsAction.FETCH_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        report: action.payload.data,
      };
    case ReportsAction.FETCH_REPORT_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    default:
      return { ...state };
  }
};

export { reducer as ReportsListViewReducer };
