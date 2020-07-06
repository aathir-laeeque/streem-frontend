import { ComposerActionType } from './../types';
import { setTasks } from './actions';
import { Task, TaskViewActionType } from './TaskView/types';
import { Stage } from '../StageList/types';

export type TasksById = Record<Task['id'], Task>;

export interface TaskListState {
  activeTaskId?: Task['id'];
  activeStageName?: Stage['name'];
  list: TasksById;
  stageOrderPosition?: Stage['orderTree'];
}

export enum TaskListAction {
  SET_TASKS = '@@checklist/composer/task_list/SET_TASKS',
  SET_ACTIVE_TASK = '@@checklist/composer/task_list/SET_ACTIVE_TASK',
}

export type TaskListActionType =
  | ReturnType<typeof setTasks> // Tasks list related actions
  | TaskViewActionType // Task related actions
  | ComposerActionType; // Composer actions, as it passed from the main reducer
