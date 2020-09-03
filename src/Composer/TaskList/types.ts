import { Media, Task } from '../checklist.types';
import { ComposerActionType } from '../types';
import { ActivityListActionType } from '../ActivityList/types';
import {
  completeTask,
  setActiveTask,
  setTasksList,
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
  SET_TASKS_LIST = '@@composer/task-list/SET_TASKS_LIST',

  START_TASK = '@@composer/task-list/task/START_TASK',
  COMPLETE_TASK = '@@composer/task-list/task/COMPLETE_TASK',
  SKIP_TASK = '@@composer/task-list/task/SKIP_TASK',

  UPDATE_TASK_EXECUTION_STATUS = '@@composer/task-list/task/UPDATE_TASK_EXECUTION_STATUS',

  SET_TASK_ERROR = '@@composer/task-list/task/SET_TASK_ERROR',
}

export type TaskListActionType = ReturnType<
  | typeof setActiveTask
  | typeof startTask
  | typeof completeTask
  | typeof skipTask
  | typeof updateTaskExecutionStatus
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
}

export enum StartedTaskStates {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'INPROGRESS',
  SKIPPED = 'SKIPPED',
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
