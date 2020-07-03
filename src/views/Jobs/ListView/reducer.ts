import {
  ListViewActionType,
  ListViewState,
  ListViewAction,
  JobStatus,
} from './types';

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  selectedStatus: JobStatus.UNASSIGNED,
  jobs: {
    assigned: {
      list: [],
      pageable: undefined,
    },
    unassigned: {
      list: [],
      pageable: undefined,
    },
  },
};

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  const { jobs } = state;
  switch (action.type) {
    case ListViewAction.FETCH_JOBS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_JOBS_SUCCESS:
      if (action.payload?.data) {
        const { data, pageable } = action.payload;
        const type = action.payload?.type;
        const oldList = pageable?.page === 0 ? [] : jobs[type].list || [];
        if (type) {
          jobs[type].list = [...oldList, ...data];
          jobs[type].pageable = pageable;
        }
      }
      return {
        ...state,
        loading: false,
        jobs: jobs,
      };
    case ListViewAction.FETCH_JOBS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    case ListViewAction.SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.payload?.status || state.selectedStatus,
      };
    case ListViewAction.CREATE_JOB_SUCCESS:
      if (action.payload?.data) {
        const oldList = jobs[JobStatus.UNASSIGNED].list || [];
        jobs[JobStatus.UNASSIGNED].list = [action.payload?.data, ...oldList];
      }
      return {
        ...state,
        jobs: jobs,
      };
    default:
      return { ...state };
  }
};

export { reducer as JobListViewReducer };
