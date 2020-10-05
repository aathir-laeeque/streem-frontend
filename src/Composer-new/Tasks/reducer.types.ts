import { Task } from '../checklist.types';
import { ComposerActionType } from '../reducer.types';
import { addNewStageSuccess, deleteStageSuccess } from '../Stages/actions';
import { updateTask } from './actions';
import {
  addNewTaskError,
  addNewTaskSuccess,
  deleteTaskError,
  deleteTaskSuccess,
  setActiveTask,
} from './actions';

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
  ADD_NEW_TASK_ERROR = '@@composer/prototype/task-list/ADD_NEW_TASK_ERROR',
  ADD_NEW_TASK_SUCCESS = '@@composer/prototype/task-list/ADD_NEW_TASK_SUCCESS',

  ADD_STOP = '@@composer/prototype/task-list/ADD_STOP',

  DELETE_TASK = '@@composer/prototype/task-list/DELETE_TASK',
  DELETE_TASK_ERROR = '@@composer/prototype/task-list/DELETE_TASK_ERROR',
  DELETE_TASK_SUCCESS = '@@composer/prototype/task-list/DELETE_TASK_SUCCESS',

  REMOVE_STOP = '@@composer/prototype/task-list/REMOVE_STOP',

  SET_ACTIVE_TASK = '@@composer/prototype/task-list/SET_ACTIVE_TASK',

  UPDATE_TASK = '@@composer/prototype/task-list/UPDATE_TASK',
}

export type TaskListActionType =
  | ReturnType<
      | typeof addNewTaskError
      | typeof addNewTaskSuccess
      | typeof deleteTaskError
      | typeof deleteTaskSuccess
      | typeof setActiveTask
      | typeof updateTask
    >
  | ReturnType<typeof addNewStageSuccess | typeof deleteStageSuccess>
  | ComposerActionType;
