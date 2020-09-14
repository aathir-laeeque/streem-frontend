import { Entity } from '#Composer/composer.types';
import { Reducer } from 'redux';

import { ComposerAction } from '../composer.reducer.types';
import { getTasks } from '../utils';
import { ActivityListAction } from '../ActivityList/reducer.types';
import {
  TaskListActionType,
  TaskListState,
  TaskListAction,
} from './reducer.types';

export const initialState: TaskListState = {
  activeTaskId: undefined,

  tasksById: {},
  taskIdWithStop: undefined,
  tasksOrderInStage: [],

  stageIdWithTaskStop: undefined,
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getTasks({ checklist, setActiveTask: true }),
      };

    case TaskListAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.id };

    case TaskListAction.UPDATE_TASK_EXECUTION_STATUS:
      const taskToUpdate = state.tasksById[action.payload.taskId];

      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...taskToUpdate,
            taskExecution: action.payload.data,
          },
        },
      };

    case TaskListAction.SET_TASK_ERROR:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...state.tasksById[action.payload.taskId],
            hasError: true,
          },
        },
      };

    case ActivityListAction.EXECUTE_ACTIVITY:
    case ActivityListAction.FIX_ACTIVITY:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,

          ...(state.activeTaskId
            ? {
                [state.activeTaskId]: {
                  ...state.tasksById[state.activeTaskId],
                  hasError: false,
                },
              }
            : {}),
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as taskListReducer };
