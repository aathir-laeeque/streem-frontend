import { Entity } from '#JobComposer/composer.types';
import { Reducer } from 'redux';

import { ComposerAction } from '../composer.reducer.types';
import { getTasks } from '../utils';
import { ActivityListAction } from '../ActivityList/reducer.types';
import { StageListAction } from '../StageList/reducer.types';
import { reEvaluateTaskWithStop } from './utils';
import {
  TaskListActionType,
  TaskListState,
  TaskListAction,
} from './reducer.types';
import { Task, TaskExecutionState } from '../checklist.types';

export const initialState: TaskListState = {
  activeTaskId: undefined,

  bringIntoView: false,

  tasksById: {},
  taskIdWithStop: undefined,
  tasksOrderInStage: [],

  stageIdWithTaskStop: undefined,
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  let oldTask: Task;
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity, setActive } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getTasks({ checklist, setActiveTask: setActive }),
      };

    case StageListAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeTaskId: state.tasksOrderInStage[action.payload.id][0],
        bringIntoView: true,
      };

    case TaskListAction.SET_ACTIVE_TASK:
      return {
        ...state,
        activeTaskId: action.payload.id,
        bringIntoView: action.payload.bringIntoView,
      };

    case TaskListAction.UPDATE_TASK_EXECUTION_STATE:
      const { data: taskExecution, taskId } = action.payload;

      const taskToUpdate = state.tasksById[action.payload.taskId];

      const tasksById = {
        ...state.tasksById,
        [taskId]: { ...taskToUpdate, taskExecution },
      };

      return {
        ...state,
        tasksById,
        ...(taskId === state.taskIdWithStop &&
        (taskExecution.state === TaskExecutionState.COMPLETED ||
          taskExecution.state === TaskExecutionState.COMPLETED_WITH_EXCEPTION)
          ? reEvaluateTaskWithStop({
              tasksById,
              tasksOrderInStage: state.tasksOrderInStage,
            })
          : {}),
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

    case TaskListAction.REMOVE_TASK_ERROR:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...state.tasksById[action.payload.taskId],
            hasError: false,
          },
        },
      };

    case TaskListAction.ASSIGN_USER_TO_TASK:
      oldTask = state.tasksById[action.payload.taskId];
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...oldTask,
            taskExecution: {
              ...oldTask.taskExecution,
              assignees: [
                ...oldTask.taskExecution.assignees,
                action.payload.user,
              ],
            },
          },
        },
      };
    case TaskListAction.UNASSIGN_USER_FROM_TASK:
      oldTask = state.tasksById[action.payload.taskId];
      const newAssignees = oldTask.taskExecution.assignees.filter(
        (item) => item.id !== action.payload.user.id,
      );
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...oldTask,
            taskExecution: {
              ...oldTask.taskExecution,
              assignees: newAssignees,
            },
          },
        },
      };
    case TaskListAction.REVERT_USERS_FOR_TASK:
      oldTask = state.tasksById[action.payload.taskId];
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...oldTask,
            taskExecution: {
              ...oldTask.taskExecution,
              assignees: action.payload.users,
            },
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