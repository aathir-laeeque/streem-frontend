import {
  JobStatus,
  ListViewAction,
  ListViewActionType,
  ListViewState,
} from './types';

const initialState: ListViewState = {
  loading: true,
  error: undefined,
  selectedStatus: JobStatus.UNASSIGNED,
  jobs: {
    assigned: {
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
    unassigned: {
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
    completed: {
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
  },
};

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  const { jobs, selectedStatus } = state;
  switch (action.type) {
    case ListViewAction.FETCH_JOBS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_JOBS_SUCCESS:
      const { data, pageable, type } = action.payload;
      if (data && type && pageable) {
        const oldList = pageable?.page === 0 ? [] : jobs[type].list;
        jobs[type].list = [...oldList, ...data];
        jobs[type].pageable = pageable;
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
    case ListViewAction.ASSIGN_USER:
      const { selectedJobIndex, user } = action.payload;
      const oldUsers = jobs[selectedStatus].list[selectedJobIndex].assignees;
      jobs[selectedStatus].list[selectedJobIndex].assignees = [
        ...oldUsers,
        user,
      ];
      return {
        ...state,
        jobs,
      };
    case ListViewAction.UNASSIGN_USER:
      if (action.payload) {
        const { selectedJobIndex, user } = action.payload;
        const newUsers = jobs[selectedStatus].list[
          selectedJobIndex
        ].assignees.filter((u) => u.id !== user.id);
        jobs[selectedStatus].list[selectedJobIndex].assignees = [...newUsers];
        return {
          ...state,
          jobs,
        };
      }
    default:
      return { ...state };
  }
};

export { reducer as JobListViewReducer };
