import { RouteComponentProps } from '@reach/router';

import { Task, Pageable } from '../types';
import {
  fetchTasks,
  fetchTasksError,
  fetchTasksOngoing,
  fetchTasksSuccess,
} from './action';

export type ListViewProps = RouteComponentProps;
export interface ListViewState {
  readonly tasks: Task[] | [] | undefined;
  readonly pageable: Pageable | undefined;
  readonly properties: string[] | [] | undefined;
  readonly loading: boolean;
  readonly error: any;
}

export enum ListViewAction {
  FETCH_TASKS = '@@task/ListView/FETCH_TASKS',
  FETCH_TASKS_ERROR = '@@task/ListView/FETCH_TASKS_ERROR',
  FETCH_TASKS_ONGOING = '@@task/ListView/FETCH_TASKS_ONGOING',
  FETCH_TASKS_SUCCESS = '@@task/ListView/FETCH_TASKS_SUCCESS',
}

export type ListViewActionType = ReturnType<
  | typeof fetchTasks
  | typeof fetchTasksError
  | typeof fetchTasksOngoing
  | typeof fetchTasksSuccess
>;
