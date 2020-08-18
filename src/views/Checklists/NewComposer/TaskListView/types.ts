import { Task } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { setTasks } from './actions';

export interface TaskListViewState {
  list: Task[] | [];
  listById: Record<Task['id'], Task>;
}

export enum TaskListAction {
  SET_TASKS = '@@composer/task_list/SET_TASKS',
}

export type TaskListViewActionType =
  | ReturnType<typeof setTasks>
  | ComposerActionType;
