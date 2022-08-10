import { Pageable } from '#utils/globalTypes';
import { Checklist } from '../types';
import { ListViewAction, ListViewActionType, ListViewState } from './types';

const initalPageable = {
  page: 0,
  pageSize: 10,
  numberOfElements: 0,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: true,
  empty: true,
};

const initialState: ListViewState = {
  checklists: [],
  currentPageData: [],
  automations: [],
  loading: false,
  pageable: initalPageable,
  jobLogs: [],
};

// TODO: optimize the reducer for Published and prototype tabs
const reducer = (state = initialState, action: ListViewActionType): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_AUTOMATIONS:
    case ListViewAction.FETCH_PROCESS_LOGS:
    case ListViewAction.FETCH_CHECKLISTS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.CLEAR_DATA:
      return { ...state, checklists: [], pageable: initalPageable };

    case ListViewAction.FETCH_CHECKLISTS_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        pageable: pageable as Pageable,
        checklists:
          pageable && pageable.page === 0
            ? (data as Array<Checklist>)
            : [...state.checklists, ...(data as Array<Checklist>)],
        currentPageData: data as Checklist[],
      };

    case ListViewAction.FETCH_AUTOMATIONS_ERROR:
    case ListViewAction.FETCH_PROCESS_LOGS_ERROR:
    case ListViewAction.FETCH_CHECKLISTS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ListViewAction.FETCH_AUTOMATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        automations: action.payload.data!,
        pageable: action.payload.pageable!,
      };

    case ListViewAction.UPDATE_LIST:
      return {
        ...state,
        currentPageData: state.currentPageData.filter(
          (checklist) => checklist.id !== action.payload.id,
        ),
      };

    case ListViewAction.FETCH_PROCESS_LOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        jobLogs: action.payload.data!,
        // TODO :: Remove this check when BE supports pagination.
        ...(action.payload?.pageable && {
          pageable: action.payload.pageable,
        }),
      };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistListViewReducer };
