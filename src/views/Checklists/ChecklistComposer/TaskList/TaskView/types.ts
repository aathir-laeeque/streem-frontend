import { setActiveTask, updateTask } from './actions';
import { Interaction } from './InteractionsList/types';
import { Media } from './Media/types';

export interface Timer {
  id: number;
  operator: string;
  value: string;
  unit: string;
}

export interface Task {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  hasStop: boolean;
  activities: Interaction[];
  medias: Media[];
  timed: boolean;
  timer?: Timer;
}

export interface HeaderProps {
  task: Task;
}

export enum TaskViewAction {
  SET_ACTIVE_TASK = '@@checklist/composer/step_view/SET_ACTIVE_TASK',
  UPDATE_TASK = '@@checklist/composer/step_view/UPDATE_TASK',
}

export type TaskViewActionType = ReturnType<
  typeof setActiveTask | typeof updateTask
>;

export type updateParams = Partial<Pick<Task, 'name' | 'hasStop' | 'timed'>>;
