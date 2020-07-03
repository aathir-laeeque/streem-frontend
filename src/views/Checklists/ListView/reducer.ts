import { ListViewAction, ListViewActionType, ListViewState } from './types';

const initialState: ListViewState = {
  checklists: undefined,
  pageable: undefined,
  loading: false,
  error: undefined,
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
