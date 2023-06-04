import { DEFAULT_PAGINATION } from '#utils/constants';

import { InboxState, ListViewAction, ListViewActionType, ListViewState } from './types';

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  selectedState: InboxState.NOT_STARTED,
  jobs: [],
  pageable: DEFAULT_PAGINATION,
};

const reducer = (state = initialState, action: ListViewActionType): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_INBOX_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_INBOX_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        jobs: data,
        pageable: pageable,
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
