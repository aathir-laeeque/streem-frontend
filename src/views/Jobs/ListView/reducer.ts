import { Job } from '../types';
import {
  JobStatus,
  ListViewAction,
  ListViewActionType,
  ListViewState,
} from './types';

const initialTabState = {
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
};

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  selectedStatus: JobStatus.UNASSIGNED,
  jobs: {
    assigned: initialTabState,
    unassigned: initialTabState,
    completed: initialTabState,
  },
};

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  const { selectedStatus } = state;
  switch (action.type) {
    case ListViewAction.FETCH_JOBS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_JOBS_SUCCESS:
      const { data, pageable, type } = action.payload;
      if (data && type && pageable) {
        return {
          ...state,
          loading: false,
          jobs: {
            ...state.jobs,
            [type]: {
              list:
                pageable?.page === 0
                  ? data
                  : [...state.jobs[type].list, ...data],
              pageable,
            },
          },
        };
      }
      return { ...state };

    case ListViewAction.FETCH_JOBS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ListViewAction.SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.payload?.status || selectedStatus,
      };

    case ListViewAction.CREATE_JOB_SUCCESS:
      if (action.payload?.data) {
        return {
          ...state,
          jobs: {
            ...state.jobs,
            [JobStatus.UNASSIGNED]: {
              ...state.jobs[JobStatus.UNASSIGNED],
              list: [
                action.payload?.data,
                ...state.jobs[JobStatus.UNASSIGNED].list,
              ],
            },
          },
        };
      }
      return { ...state };

    case ListViewAction.ASSIGN_USER:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [selectedStatus]: {
            ...state.jobs[selectedStatus],
            list: (state.jobs[selectedStatus].list as Job[]).map(
              (item, index) => {
                if (index !== action.payload.selectedJobIndex) {
                  return item;
                }
                return {
                  ...item,
                  assignees: [...item.assignees, action.payload.user],
                };
              },
            ),
          },
        },
      };

    case ListViewAction.UNASSIGN_USER:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [selectedStatus]: {
            ...state.jobs[selectedStatus],
            list: (state.jobs[selectedStatus].list as Job[]).map(
              (item, index) => {
                if (index !== action.payload.selectedJobIndex) {
                  return item;
                }
                return {
                  ...item,
                  assignees: item.assignees.filter(
                    (u) => u.id !== action.payload.user.id,
                  ),
                };
              },
            ),
          },
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as JobListViewReducer };
