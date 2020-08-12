import { ComposerActionType } from './composer.types';
import { Task } from './checklist.types';

export interface TaskListViewState {
  list: Task[] | [];
  activeTaskId: Task['id'] | undefined;
}

export enum TaskListAction {
  // SET_TASKS = '@@composer/task_list/SET_TASKS',
  SET_ACTIVE_TASK = '@@composer/task_list/SET_ACTIVE_TASK',
}

export type TaskListViewActionType = ComposerActionType;
