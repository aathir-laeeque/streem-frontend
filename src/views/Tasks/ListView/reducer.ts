import { ListViewActionType, ListViewState, ListViewAction } from './types';

const initialState: ListViewState = {
  tasks: undefined,
  pageable: undefined,
  properties: undefined,
  loading: false,
  error: undefined,
};

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_TASKS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload?.tasks.data,
        properties: ['PRODUCT MANUFACTURED', 'BATCH NUMBER', 'ROOM ID'],
        pageable: action.payload?.tasks.pageable,
      };

    case ListViewAction.FETCH_TASKS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as TaskListViewReducer };
