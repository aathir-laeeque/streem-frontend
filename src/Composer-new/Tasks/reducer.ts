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
          [newTask.id]: newTask,
        },
        tasksOrderInStage: {
          ...state.tasksOrderInStage,
          [stageId.toString()]: [
            ...state.tasksOrderInStage[stageId.toString()],
            newTask.id,
          ],
        },
      };

    case TaskListActions.DELETE_TASK_SUCCESS:
      return {
        ...state,
        listById: {
          ...omit(state.listById, [action.payload.taskId.toString()]),
        },
        tasksOrderInStage: {
          ...state.tasksOrderInStage,
          [action.payload.stageId.toString()]: state.tasksOrderInStage[
            action.payload.stageId.toString()
          ].filter((el) => el !== action.payload.taskId),
        },
      };

    case TaskListActions.UPDATE_TASK:
      return {
        ...state,
        listById: {
          ...state.listById,
          [action.payload.task.id]: action.payload.task,
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
          ...omit(state.tasksOrderInStage, [action.payload.id.toString()]),
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
