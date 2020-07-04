import { Reducer } from 'redux';
import { omit } from 'lodash';

import { TaskViewAction } from './TaskView/types';
import { TaskListAction, TaskListActionType, TaskListState } from './types';

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

    case TaskViewAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.taskId };

    case TaskViewAction.UPDATE_TASK:
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.task.id]: {
            ...state.list[action.payload.task.id],
            ...omit(action.payload.task, ['id']),
          },
        },
      };

    default:
      return state;
  }
};

export { reducer as tasksListReducer };
