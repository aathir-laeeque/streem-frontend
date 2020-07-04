import { ComposerActionType } from './../types';
import { setActiveTask, setTasks } from './actions';
import { Task } from './StepView/types';

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
  | ReturnType<typeof setTasks | typeof setActiveTask>
  | ComposerActionType;
