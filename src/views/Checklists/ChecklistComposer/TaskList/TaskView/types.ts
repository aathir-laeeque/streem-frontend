import { setActiveTask, updateTask } from './actions';
import { Activity, ActivityActionType } from './ActivityList/Activity/types';
import { Media } from './Media/types';

export interface Task {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  hasStop: boolean;
  activities: Activity[];
  medias: Media[];
  timed: boolean;
  period?: number;
}

export interface HeaderProps {
  task: Task;
}

export enum TaskViewAction {
  SET_ACTIVE_TASK = '@@composer/task_view/SET_ACTIVE_TASK',
  UPDATE_TASK = '@@composer/task_view/UPDATE_TASK',
  COMPLETE_TASK = '@@composer/task_view/COMPLETE_TASK',
}

export type TaskViewActionType =
  | ReturnType<typeof setActiveTask | typeof updateTask>
  | ActivityActionType;

export type updateParams = Partial<Pick<Task, 'name' | 'hasStop' | 'timed'>>;
