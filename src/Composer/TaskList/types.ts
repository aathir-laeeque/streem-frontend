import { Task, Media } from '../checklist.types';
import { ComposerActionType } from '../types';
import { addNewTask, setActiveTask, setTasksList } from './actions';

export type ListById = Record<Task['id'], Task>;

// export type IdOrderMapping = Record<Task['id'], Task['orderTree']>;

export type TaskListState = {
  // idOrderMapping: IdOrderMapping;
  list: Task[];
  listById: ListById;
  activeTaskId?: Task['id'];
};

export enum TaskListAction {
  ADD_NEW_TASK = '@@composer/task-list/ADD_NEW_TASK',
  SET_ACTIVE_TASK = '@@composer/task-list/SET_ACTIVE_TASK',
  SET_TASKS_LIST = '@@composer/task-list/SET_TASKS_LIST',

  START_TASK = '@@composer/task-list/task/START_TASK',
}

export type TaskListActionType =
  | ReturnType<typeof setActiveTask | typeof addNewTask | typeof setTasksList>
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
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
}
