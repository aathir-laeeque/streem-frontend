import {
  InboxStatus,
  ListViewAction,
  ListViewActionType,
  ListViewState,
} from './types';

const initialState: ListViewState = {
  loading: true,
  error: undefined,
  selectedStatus: InboxStatus.MYINBOX,
  jobs: {
    myinbox: {
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
    case ListViewAction.FETCH_INBOX_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_INBOX_SUCCESS:
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
    case ListViewAction.FETCH_INBOX_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    case ListViewAction.SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.payload?.status || state.selectedStatus,
      };
    default:
      return { ...state };
  }
};

export { reducer as InboxListViewReducer };