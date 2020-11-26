import { ComposerActionType } from '../reducer.types';
import { addNewStageSuccess, deleteStageSuccess } from '../Stages/actions';
import {
  addNewTaskSuccess,
  deleteTaskSuccess,
  resetTaskActivityError,
  setActiveTask,
  setTaskError,
  setValidationError,
  updateTask,
} from './actions';
import { Task } from './types';

export type TasksById = Record<string, Task>;
export type TaskOrderInStage = Record<string, Task['id'][]>;

export type TaskListState = {
  readonly activeTaskId?: Task['id'];
  readonly error?: any;
  readonly listById: TasksById;
  readonly tasksOrderInStage: TaskOrderInStage;
};

export enum TaskListActions {
  ADD_NEW_TASK = '@@composer/prototype/task-list/ADD_NEW_TASK',
  ADD_NEW_TASK_SUCCESS = '@@composer/prototype/task-list/ADD_NEW_TASK_SUCCESS',
  ADD_STOP = '@@composer/prototype/task-list/ADD_STOP',
  ADD_TASK_MEDIA = '@@composer/prototype/task-list/ADD_TASK_MEDIA',

  DELETE_TASK = '@@composer/prototype/task-list/DELETE_TASK',
  DELETE_TASK_SUCCESS = '@@composer/prototype/task-list/DELETE_TASK_SUCCESS',

  REMOVE_STOP = '@@composer/prototype/task-list/REMOVE_STOP',
  REMOVE_TASK_MEDIA = '@@composer/prototype/task-list/REMOVE_TASK_MEDIA',
  REMOVE_TASK_TIMER = '@@composer/prototype/task-list/REMOVE_TASK_TIMER',
  RESET_TASK_ACTIVITY_ERROR = '@@composer/prototype/task-list/RESET_TASK_ACTIVITY_ERROR',

  SET_ACTIVE_TASK = '@@composer/prototype/task-list/SET_ACTIVE_TASK',
  SET_TASK_ERROR = '@@composer/prototype/task-list/SET_TASK_ERROR',
  SET_TASK_TIMER = '@@composer/prototype/task-list/SET_TASK_TIMER',
  SET_VALIDATION_ERROR = '@@composer/prototype/task-list/SET_VALIDATION_ERROR',

  UPDATE_TASK = '@@composer/prototype/task-list/UPDATE_TASK',

  UPDATE_TASK_NAME = '@@composer/prototype/task-list/UPDATE_TASK_NAME',
  UPDATE_TASK_NAME_SUCCESS = '@@composer/prototype/task-list/UPDATE_TASK_NAME_SUCCESS',
}

export type TaskListActionType =
  | ReturnType<
      | typeof addNewTaskSuccess
      | typeof deleteTaskSuccess
      | typeof resetTaskActivityError
      | typeof setActiveTask
      | typeof setTaskError
      | typeof setValidationError
      | typeof updateTask
    >
  | ReturnType<typeof addNewStageSuccess | typeof deleteStageSuccess>
  | ComposerActionType;
