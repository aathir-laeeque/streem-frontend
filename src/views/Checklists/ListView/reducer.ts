import { ListViewAction, ListViewActionType, ListViewState } from './types';

const initialState: ListViewState = {
  checklists: undefined,
  loading: false,
  error: undefined,
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

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_CHECKLISTS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_CHECKLISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        checklists: action.payload?.data,
        pageable: action.payload?.pageable,
      };

    case ListViewAction.FETCH_CHECKLISTS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistListViewReducer };
