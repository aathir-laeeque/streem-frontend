import { Media, Task } from '../checklist.types';
import {
  completeTask,
  setActiveTask,
  setTaskError,
  skipTask,
  startTask,
  updateTaskExecutionStatus,
} from './actions';

export type ListById = Record<Task['id'], Task>;

// export type IdOrderMapping = Record<Task['id'], Task['orderTree']>;

export type TaskListState = {
  // idOrderMapping: IdOrderMapping;
  listById: ListById;
  listIdOrder: Task['id'][];
  activeTaskId?: Task['id'];
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

export type TaskListActionType = ReturnType<
  | typeof setActiveTask
  | typeof startTask
  | typeof completeTask
  | typeof skipTask
  | typeof updateTaskExecutionStatus
  | typeof setTaskError
>;

export type TaskViewProps = {
  isActive: boolean;
  task: Omit<Task, 'activities'>;
};

export type TaskCardProps = TaskViewProps;

export type MediaCardProps = {
  medias: Media[];
  isTaskActive: boolean;
};

export enum TaskAction {
  START = 'start',
  COMPLETE = 'complete',
  SKIP = 'skip',
  COMPLETE_WITH_EXCEPTION = 'complete-with-exception',
}

export enum StartedTaskStates {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'INPROGRESS',
  SKIPPED = 'SKIPPED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_ERROR_CORRECTION = 'ENABLED_FOR_ERROR_CORRECTION',
}

export enum NotStartedTaskStates {
  NOT_STARTED = 'NOT_STARTED',
}

export const TaskExecutionStatus = {
  ...StartedTaskStates,
  ...NotStartedTaskStates,
};

export type TaskExecutionStatus = typeof TaskExecutionStatus;

export enum TaskErrors {
  E201 = 'TASK_INCOMPLETE',
  E202 = 'TASK_NOT_FOUND',
}
// TASK_INCOMPLETE("E201", "Task Incomplete"),
// TASK_NOT_FOUND("E202", "Task Not Found"),
