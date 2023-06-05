import { ComposerActionType } from '../reducer.types';
import { addNewStageSuccess, deleteStageSuccess } from '../Stages/actions';
import {
  addNewTaskSuccess,
  deleteTaskSuccess,
  reOrderTaskError,
  reOrderTaskSuccess,
  resetTaskError,
  resetTaskParameterError,
  setActiveTask,
  setTaskError,
  setValidationError,
  updateTask,
  updateTaskActionSuccess,
  updateTaskMediaSuccess,
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
  ADD_NEW_TASK = '@@prototypeComposer/prototype/task-list/ADD_NEW_TASK',
  ADD_NEW_TASK_SUCCESS = '@@prototypeComposer/prototype/task-list/ADD_NEW_TASK_SUCCESS',
  ADD_STOP = '@@prototypeComposer/prototype/task-list/ADD_STOP',
  ADD_TASK_MEDIA = '@@prototypeComposer/prototype/task-list/ADD_TASK_MEDIA',
  UPDATE_TASK_MEDIA = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_MEDIA',
  UPDATE_TASK_MEDIA_SUCCESS = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_MEDIA_SUCCESS',

  DELETE_TASK = '@@prototypeComposer/prototype/task-list/DELETE_TASK',
  DELETE_TASK_SUCCESS = '@@prototypeComposer/prototype/task-list/DELETE_TASK_SUCCESS',

  REMOVE_STOP = '@@prototypeComposer/prototype/task-list/REMOVE_STOP',
  REMOVE_TASK_MEDIA = '@@prototypeComposer/prototype/task-list/REMOVE_TASK_MEDIA',
  REMOVE_TASK_TIMER = '@@prototypeComposer/prototype/task-list/REMOVE_TASK_TIMER',
  RESET_TASK_PARAMETER_ERROR = '@@prototypeComposer/prototype/task-list/RESET_TASK_PARAMETER_ERROR',
  RESET_TASK_ERROR = '@@prototypeComposer/prototype/task-list/RESET_TASK_ERROR',

  SET_ACTIVE_TASK = '@@prototypeComposer/prototype/task-list/SET_ACTIVE_TASK',
  SET_TASK_ERROR = '@@prototypeComposer/prototype/task-list/SET_TASK_ERROR',
  SET_TASK_TIMER = '@@prototypeComposer/prototype/task-list/SET_TASK_TIMER',
  SET_VALIDATION_ERROR = '@@prototypeComposer/prototype/task-list/SET_VALIDATION_ERROR',

  UPDATE_TASK = '@@prototypeComposer/prototype/task-list/UPDATE_TASK',

  UPDATE_TASK_NAME = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_NAME',
  UPDATE_TASK_NAME_SUCCESS = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_NAME_SUCCESS',
  REORDER_TASK = '@@prototypeComposer/prototype/task-list/REORDER_TASK',
  REORDER_TASK_SUCCESS = '@@prototypeComposer/prototype/task-list/REORDER_TASK_SUCCESS',
  REORDER_TASK_ERROR = '@@prototypeComposer/prototype/task-list/REORDER_TASK_ERROR',
  ADD_TASK_ACTION = '@@prototypeComposer/prototype/task-list/ADD_TASK_ACTION',
  UPDATE_TASK_ACTION = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_ACTION',
  UPDATE_TASK_ACTION_SUCCESS = '@@prototypeComposer/prototype/task-list/UPDATE_TASK_ACTION_SUCCESS',
  ARCHIVE_TASK_ACTION = '@@prototypeComposer/prototype/task-list/ARCHIVE_TASK_ACTION',
  REORDER_PARAMETERS = '@@prototypeComposer/prototype/task-list/REORDER_PARAMETERS',
  ADD_MULTIPLE_TASK_ACTION = '@@prototypeComposer/prototype/task-list/ADD_MULTIPLE_TASK_ACTION',
}

export type TaskListActionType =
  | ReturnType<
      | typeof addNewTaskSuccess
      | typeof deleteTaskSuccess
      | typeof resetTaskParameterError
      | typeof setActiveTask
      | typeof setTaskError
      | typeof setValidationError
      | typeof updateTask
      | typeof updateTaskMediaSuccess
      | typeof resetTaskError
      | typeof reOrderTaskSuccess
      | typeof reOrderTaskError
      | typeof updateTaskActionSuccess
    >
  | ReturnType<typeof addNewStageSuccess | typeof deleteStageSuccess>
  | ComposerActionType;
