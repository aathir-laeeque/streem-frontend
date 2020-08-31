import { Media, Task } from '../checklist.types';
import { ComposerActionType } from '../types';
import {
  addNewTask,
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
  ADD_NEW_TASK = '@@composer/task-list/ADD_NEW_TASK',
  SET_ACTIVE_TASK = '@@composer/task-list/SET_ACTIVE_TASK',
  SET_TASKS_LIST = '@@composer/task-list/SET_TASKS_LIST',

  START_TASK = '@@composer/task-list/task/START_TASK',
  COMPLETE_TASK = '@@composer/task-list/task/COMPLETE_TASK',
  SKIP_TASK = '@@composer/task-list/task/SKIP_TASK',

  UPDATE_TASK_EXECUTION_STATUS = '@@composer/task-list/task/UPDATE_TASK_EXECUTION_STATUS',
}

export type TaskListActionType =
  | ReturnType<
      | typeof setActiveTask
      | typeof addNewTask
      | typeof setTasksList
      | typeof startTask
      | typeof updateTaskExecutionStatus
      | typeof completeTask
      | typeof skipTask
    >
  | ComposerActionType;

export type TaskViewProps = {
  isActive: boolean;
  task: Task;
};

export type TaskCardProps = TaskViewProps;

export type MediaCardProps = {
  medias: Media[];
  isTaskActive: boolean;
};

export enum TaskExecutionStatus {
  COMPLETED = 'COMPLETED',
  INPROGRESS = 'INPROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SKIPPED = 'SKIPPED',
}
