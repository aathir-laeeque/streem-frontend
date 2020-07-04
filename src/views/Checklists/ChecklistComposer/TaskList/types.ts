import { ComposerActionType } from './../types';
import { setTasks } from './actions';
import { Task, TaskViewActionType } from './TaskView/types';

export type TasksById = Record<Task['id'], Task>;
export interface TaskListState {
  list: TasksById;
  activeTaskId?: Task['id'];
}

export enum TaskListAction {
  SET_TASKS = '@@checklist/composer/task_list/SET_TASKS',
  SET_ACTIVE_TASK = '@@checklist/composer/task_list/SET_ACTIVE_TASK',
}

export type TaskListActionType =
  | ReturnType<typeof setTasks>
  | TaskViewActionType
  | ComposerActionType;
