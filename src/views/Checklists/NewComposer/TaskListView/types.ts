import { Task } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { updateTask, setTaskActive } from './actions';

export type TaskListById = Record<Task['id'], Task>;
export interface TaskListViewState {
  activeTaskId: Task['id'];
  list: TaskListById;
}

export enum TaskListAction {
  SET_TASK_ACTIVE = '@@composer/task_list/SET_TASK_ACTIVE',
  UPDATE_TASK = '@@composer/task_list/UPDATE_TASK',
}

export type UpdateTaskParams = Pick<Task, 'name'>;

export type TaskListViewActionType =
  | ReturnType<typeof updateTask | typeof setTaskActive>
  | ComposerActionType;
