import { Reducer } from 'redux';

import { fetchDataSuccess } from '../actions';
import { Task } from '../checklist.types';
import { ComposerAction, Entity } from '../types';
import {
  TaskListActionType,
  TaskListState,
  TaskListAction,
  ListById,
} from './types';

export const initialState: TaskListState = {
  activeTaskId: undefined,
  list: [],
  listById: {},
};

const getTasks = ({
  payload: { data, entity },
}: ReturnType<typeof fetchDataSuccess>): Task[] => {
  if (entity === Entity.CHECKLIST) {
    return data?.stages[0].tasks ?? [];
  } else {
    return data?.checklist?.stages[0].tasks ?? [];
  }
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const tasks = getTasks(action);

      return {
        ...state,
        activeTaskId: tasks[0].id,
        list: tasks,
        listById: tasks.reduce<ListById>((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {}),
      };

    case TaskListAction.SET_TASKS_LIST:
      return {
        ...state,
        list: action.payload.tasks,
        activeTaskId: action.payload.tasks[0].id,
      };

    case TaskListAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.id };

    default:
      return state;
  }
};

export { reducer as taskListReducer };
