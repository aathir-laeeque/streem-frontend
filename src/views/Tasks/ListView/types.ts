import { RouteComponentProps } from '@reach/router';

import { Task, Pageable } from '../types';
import {
  fetchTasks,
  fetchTasksError,
  fetchTasksOngoing,
  fetchTasksSuccess,
  createTask,
  createTaskOngoing,
  createTaskSuccess,
  createTaskError,
  setSelectedStatus,
} from './actions';

export type ListViewProps = RouteComponentProps;

export type Tasks = Record<
  string,
  {
    list: Task[] | undefined;
    pageable: Pageable | undefined;
  }
>;
export interface ListViewState {
  readonly tasks: Tasks;
  readonly loading: boolean;
  readonly error: any;
  readonly selectedStatus: string;
}

export enum TaskStatus {
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
}

export enum ListViewAction {
  FETCH_TASKS = '@@task/ListView/FETCH_TASKS',
  FETCH_TASKS_ERROR = '@@task/ListView/FETCH_TASKS_ERROR',
  FETCH_TASKS_ONGOING = '@@task/ListView/FETCH_TASKS_ONGOING',
  FETCH_TASKS_SUCCESS = '@@task/ListView/FETCH_TASKS_SUCCESS',
  CREATE_TASK = '@@task/ListView/CREATE_TASK',
  CREATE_TASK_ERROR = '@@task/ListView/CREATE_TASK_ERROR',
  CREATE_TASK_ONGOING = '@@task/ListView/CREATE_TASK_ONGOING',
  CREATE_TASK_SUCCESS = '@@task/ListView/CREATE_TASK_SUCCESS',
  SET_SELECTED_STATUS = '@@task/ListView/SET_SELECTED_STATUS',
}

export type ListViewActionType = ReturnType<
  | typeof fetchTasks
  | typeof fetchTasksError
  | typeof fetchTasksOngoing
  | typeof fetchTasksSuccess
  | typeof createTask
  | typeof createTaskOngoing
  | typeof createTaskSuccess
  | typeof createTaskError
  | typeof setSelectedStatus
>;
