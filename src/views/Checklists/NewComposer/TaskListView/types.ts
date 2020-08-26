import { Task } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { setTasks, updateTask } from './actions';

export type TaskListById = Record<Task['id'], Task>;
export interface TaskListViewState {
  activeTaskId?: Task['id'];
  list: TaskListById;
}

export enum TaskListAction {
  SET_TASKS = '@@composer/task_list/SET_TASKS',
  UPDATE_TASK = '@@composer/task_list/UPDATE_TASK',
}

export type TaskListViewActionType =
  | ReturnType<typeof setTasks | typeof updateTask>
  | ComposerActionType;
