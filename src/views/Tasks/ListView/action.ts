import { ListViewAction } from './types';
import { actionSpreader } from '../../../store/helpers';
import { TasksObj } from '../types';

export const fetchTasks = (params: { page: number; size: number }) =>
  actionSpreader(ListViewAction.FETCH_TASKS, params);

export const fetchTasksOngoing = () =>
  actionSpreader(ListViewAction.FETCH_TASKS_ONGOING);

export const fetchTasksSuccess = (tasks: TasksObj) =>
  actionSpreader(ListViewAction.FETCH_TASKS_SUCCESS, { tasks });

export const fetchTasksError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_TASKS_ERROR, { error });
