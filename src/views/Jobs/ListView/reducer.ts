import { ListViewAction, ListViewActionType, ListViewState } from './types';

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  jobs: [],
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

// TODO: optimize the reducer for Unassigned, Assigned and completed tabs
const reducer = (state = initialState, action: ListViewActionType): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_JOBS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_JOBS_SUCCESS:
      const { data, pageable } = action.payload;

      return {
        ...state,
        loading: false,
        jobs: data,
        pageable: pageable,
      };

    case ListViewAction.FETCH_JOBS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as NewJobListViewReducer };
