import { Reducer } from 'redux';

import { fetchDataSuccess } from '../actions';
import { Task } from '../checklist.types';
import { ComposerAction, Entity } from '../types';
import {
  ListById,
  TaskExecutionStatus,
  TaskListAction,
  TaskListActionType,
  TaskListState,
} from './types';

export const initialState: TaskListState = {
  activeTaskId: undefined,
  listById: {},
  listIdOrder: [],
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

const transformTasks = (tasks: Task[]) =>
  tasks.reduce<ListById>((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

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
        listById: transformTasks(tasks),
        listIdOrder: tasks.map((task) => task.id),
      };

    case TaskListAction.SET_TASKS_LIST:
      return {
        ...state,
        activeTaskId: action.payload.tasks[0].id,
        listById: transformTasks(action.payload.tasks),
        listIdOrder: action.payload.tasks.map((task) => task.id),
      };

    case TaskListAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.id };

    case TaskListAction.UPDATE_TASK_EXECUTION_STATUS:
      const taskToUpdate = state.listById[action.payload.taskId];

      return {
        ...state,
        listById: {
          ...state.listById,
          [action.payload.taskId]: {
            ...taskToUpdate,
            taskExecution: {
              ...taskToUpdate.taskExecution,
              status: action.payload.status,
            },
          },
        },
      };

    default:
      return state;
  }
};

export { reducer as taskListReducer };
