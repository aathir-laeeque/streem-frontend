import { Job } from '#views/Jobs/types';
import { omit } from 'lodash';
import { Reducer } from 'redux';

import { Checklist } from '../checklist.types';
import { ComposerAction } from '../reducer.types';
import { StageListActions } from '../Stages/reducer.types';
import { ComposerEntity } from '../types';
import {
  TaskListActions,
  TaskListActionType,
  TaskListState,
  TasksById,
} from './reducer.types';
import { getTasks } from './utils';

export const initialState: TaskListState = {
  activeTaskId: undefined,
  error: undefined,
  listById: {},
  tasksOrderInStage: {},
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity } = action.payload;

      const isChecklist = entity === ComposerEntity.CHECKLIST;

      const checklist = isChecklist
        ? (data as Checklist)
        : (data as Job).checklist;

      return {
        ...state,
        ...getTasks(checklist),
        activeTaskId: (checklist?.stages ?? [])[0]?.tasks[0]?.id,
      };

    case TaskListActions.SET_ACTIVE_TASK:
      return {
        ...state,
        activeTaskId: action.payload.taskId,
      };

    case TaskListActions.ADD_NEW_TASK_SUCCESS:
      const { newTask, stageId } = action.payload;

      return {
        ...state,
        listById: {
          ...state.listById,
          [newTask.id]: { ...newTask, errors: [] },
        },
        tasksOrderInStage: {
          ...state.tasksOrderInStage,
          [stageId]: [...state.tasksOrderInStage[stageId], newTask.id],
        },
      };

    case TaskListActions.DELETE_TASK_SUCCESS:
      return {
        ...state,
        listById: {
          ...omit(state.listById, [action.payload.taskId]),
          ...Object.entries(action.payload.newOrderMap || {})
            .map(([taskId, orderTree]) => ({
              ...state.listById[taskId],
              orderTree,
            }))
            .reduce<TasksById>((acc, task) => {
              acc[task.id] = task;
              return acc;
            }, {}),
        },
        tasksOrderInStage: {
          ...state.tasksOrderInStage,
          [action.payload.stageId]: state.tasksOrderInStage[
            action.payload.stageId
          ].filter((el) => el !== action.payload.taskId),
        },
      };

    case TaskListActions.UPDATE_TASK:
      const updatedTask = action.payload.task;
      const updatedTaskId = updatedTask.id;

      return {
        ...state,
        listById: {
          ...state.listById,
          [updatedTaskId]: {
            ...action.payload.task,
            errors: state.listById[updatedTaskId].errors,
          },
        },
      };

    case TaskListActions.SET_VALIDATION_ERROR:
      const { error } = action.payload;
      const taskIdWithError = error.id;
      const taskWithError = state.listById[taskIdWithError];

      return {
        ...state,
        listById: {
          ...state.listById,
          [taskIdWithError]: {
            ...taskWithError,
            errors: [...taskWithError.errors, error],
          },
        },
      };

    case TaskListActions.RESET_TASK_ACTIVITY_ERROR:
      return {
        ...state,
        listById: {
          ...state.listById,
          [action.payload.taskId]: {
            ...state.listById[action.payload.taskId],
            errors: state.listById[action.payload.taskId]?.errors.filter(
              (error) => error.code !== 'E211',
            ),
          },
        },
      };

    case StageListActions.ADD_NEW_STAGE_SUCCESS:
      const { stage } = action.payload;

      return {
        ...state,
        tasksOrderInStage: {
          ...state.tasksOrderInStage,
          [stage.id]: stage.tasks.map((task) => task.id),
        },
      };

    case StageListActions.DELETE_STAGE_SUCCESS:
      return {
        ...state,
        tasksOrderInStage: {
          ...omit(state.tasksOrderInStage, [action.payload.id]),
        },
      };

    case TaskListActions.SET_TASK_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return { ...state };
  }
};

export { reducer as taskReducer };
