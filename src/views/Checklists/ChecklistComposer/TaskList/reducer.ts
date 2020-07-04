import { Reducer } from 'redux';

import { TaskListAction, TaskListState, TaskListActionType } from './types';

export const initialState: TaskListState = {
  list: {},
  activeTaskId: undefined,
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case TaskListAction.SET_TASKS:
      return { ...state, list: action.payload.tasks };

    case TaskListAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.taskId };

    default:
      return state;
  }
};

export { reducer as tasksListReducer };
