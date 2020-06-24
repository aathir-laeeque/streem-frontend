import { ListViewActionType, ListViewState, ListViewAction } from './types';

const initialState: ListViewState = {
  tasks: undefined,
  pageable: undefined,
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
        pageable: action.payload?.tasks.pageable,
      };

    case ListViewAction.FETCH_TASKS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ListViewAction.CREATE_TASK_SUCCESS:
      let newTasks = state.tasks || [];
      if (action.payload?.task) {
        newTasks = [...newTasks, action.payload?.task];
      }
      return { ...state, tasks: newTasks };

    default:
      return { ...state };
  }
};

export { reducer as TaskListViewReducer };
