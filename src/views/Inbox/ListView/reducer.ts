import { Pageable } from '#utils/globalTypes';
import { Job } from '#views/Jobs/types';
import {
  InboxState,
  ListViewAction,
  ListViewActionType,
  ListViewState,
} from './types';

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  selectedState: InboxState.MYINBOX,
  jobs: {
    myjobs: {
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
  switch (action.type) {
    case ListViewAction.FETCH_INBOX_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_INBOX_SUCCESS:
      const { data, pageable, type } = action.payload;
      return {
        ...state,
        loading: false,
        jobs: {
          ...state.jobs,
          [type]: {
            list:
              pageable && pageable.page === 0
                ? (data as Array<Job>)
                : [...state.jobs[type].list, ...(data as Job[])],
            pageable: pageable as Pageable,
          },
        },
      };

    case ListViewAction.FETCH_INBOX_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ListViewAction.SET_SELECTED_STATE:
      return {
        ...state,
        selectedState: action.payload?.state || state.selectedState,
      };

    case ListViewAction.RESET_INBOX:
      return { ...initialState };

    default:
      return { ...state };
  }
};

export { reducer as InboxListViewReducer };
