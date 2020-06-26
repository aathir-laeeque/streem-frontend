import {
  ListViewActionType,
  ListViewState,
  ListViewAction,
  TaskStatus,
} from './types';

const initialState: ListViewState = {
  loading: false,
  error: undefined,
  selectedStatus: TaskStatus.UNASSIGNED,
  tasks: {
    assigned: {
      list: undefined,
      pageable: undefined,
    },
    unassigned: {
      list: undefined,
      pageable: undefined,
    },
  },
};

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  const { tasks } = state;
  switch (action.type) {
    case ListViewAction.FETCH_TASKS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.FETCH_TASKS_SUCCESS:
      if (action.payload?.tasks) {
        const { data, pageable } = action.payload?.tasks;
        const type = action.payload?.type;
        if (type) {
          tasks[type].list = data;
          tasks[type].pageable = pageable;
        }
      }
      return {
        ...state,
        loading: false,
        tasks: tasks,
      };
    case ListViewAction.FETCH_TASKS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    case ListViewAction.SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.payload?.status || state.selectedStatus,
      };
    case ListViewAction.CREATE_TASK_SUCCESS:
      if (action.payload?.task) {
        const oldList = tasks[TaskStatus.UNASSIGNED].list || [];
        tasks[TaskStatus.UNASSIGNED].list = [...oldList, action.payload?.task];
      }
      return {
        ...state,
        tasks: tasks,
      };
    default:
      return { ...state };
  }
};

export { reducer as TaskListViewReducer };
