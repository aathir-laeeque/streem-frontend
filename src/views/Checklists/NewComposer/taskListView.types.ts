import { Task } from './checklist.types';
import { ComposerActionType } from './composer.types';
import { setTasks } from './taskListView.action';

export interface TaskListViewState {
  activeTaskId: Task['id'] | undefined;

  list: Task[] | [];
  listById: Record<Task['id'], Task>;
}

export enum TaskListAction {
  SET_TASKS = '@@composer/task_list/SET_TASKS',
  SET_ACTIVE_TASK = '@@composer/task_list/SET_ACTIVE_TASK',
}

export type TaskListViewActionType =
  | ReturnType<typeof setTasks>
  | ComposerActionType;
