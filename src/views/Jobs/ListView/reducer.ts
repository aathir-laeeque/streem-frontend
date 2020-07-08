import {
  ListViewActionType,
  ListViewState,
  ListViewAction,
  JobStatus,
} from './types';
import { Job } from '../types';

const initialState: ListViewState = {
  loading: false,
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
        if (type && pageable) {
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
    case ListViewAction.ASSIGN_USER:
      const type = state.selectedStatus;
      if (action.payload) {
        const { selectedJobIndex, user } = action.payload;
        const oldUsers = jobs[type].list[selectedJobIndex].users;
        jobs[type].list[selectedJobIndex].users = [...oldUsers, user];
        // if (type === JobStatus.UNASSIGNED) {
        //   jobs[type].list[selectedJobIndex].status = JobStatus.ASSIGNED;
        //   (jobs[JobStatus.ASSIGNED].list as Array<Job>).push(
        //     jobs[type].list[selectedJobIndex],
        //   );
        //   jobs[type].list.splice(selectedJobIndex, 1);
        // }
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
