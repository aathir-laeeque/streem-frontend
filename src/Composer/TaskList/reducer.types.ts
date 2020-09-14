import { Task } from '../checklist.types';
import {
  completeTask,
  setActiveTask,
  setTaskError,
  skipTask,
  startTask,
  updateTaskExecutionStatus,
} from './actions';
import { TasksById, TasksOrderInStage } from './types';
import { ComposerActionType } from '../composer.reducer.types';

export type TaskListState = {
  activeTaskId?: Task['id'];

  tasksById: TasksById;
  tasksOrderInStage: TasksOrderInStage;
};

export enum TaskListAction {
  SET_ACTIVE_TASK = '@@composer/task-list/SET_ACTIVE_TASK',

  START_TASK = '@@composer/task-list/task/START_TASK',
  COMPLETE_TASK = '@@composer/task-list/task/COMPLETE_TASK',
  COMPLETE_TASK_WITH_EXCEPTION = '@@composer/task-list/task/COMPLETE_TASK_WITH_EXCEPTION',
  SKIP_TASK = '@@composer/task-list/task/SKIP_TASK',

  UPDATE_TASK_EXECUTION_STATUS = '@@composer/task-list/task/UPDATE_TASK_EXECUTION_STATUS',

  SET_TASK_ERROR = '@@composer/task-list/task/SET_TASK_ERROR',
  ENABLE_TASK_ERROR_CORRECTION = '@@composer/task-list/task/ENABLE_TASK_ERROR_CORRECTION',
  CANCEL_ERROR_CORRECTION = '@@composer/task-list/task/CANCEL_ERROR_CORRECTION',
  COMPLTE_ERROR_CORRECTION = '@@composer/task-list/task/COMPLTE_ERROR_CORRECTION',
}

export type TaskListActionType =
  | ReturnType<
      | typeof completeTask
      | typeof setActiveTask
      | typeof setTaskError
      | typeof skipTask
      | typeof startTask
      | typeof updateTaskExecutionStatus
    >
  | ComposerActionType;
