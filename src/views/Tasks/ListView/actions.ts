import { ListViewAction } from './types';
import { actionSpreader } from '../../../store/helpers';
import { TasksObj, Task } from '../types';

export const fetchTasks = (params: { page: number; size: number }) =>
  actionSpreader(ListViewAction.FETCH_TASKS, params);

export const fetchTasksOngoing = () =>
  actionSpreader(ListViewAction.FETCH_TASKS_ONGOING);

export const fetchTasksSuccess = (tasks: TasksObj) =>
  actionSpreader(ListViewAction.FETCH_TASKS_SUCCESS, { tasks });

export const fetchTasksError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_TASKS_ERROR, { error });

export const createTask = (params: {
  properties: { id: number; value: string }[];
  checklistId: number;
}) => actionSpreader(ListViewAction.CREATE_TASK, params);

export const createTaskOngoing = () =>
  actionSpreader(ListViewAction.CREATE_TASK_ONGOING);

export const createTaskSuccess = (task: Task) =>
  actionSpreader(ListViewAction.CREATE_TASK_SUCCESS, { task });

export const createTaskError = (error: any) =>
  actionSpreader(ListViewAction.CREATE_TASK_ERROR, { error });
