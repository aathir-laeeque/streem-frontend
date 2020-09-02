import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction, TaskExecutionStatus } from './types';

export const setActiveTask = (id: Task['id']) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { id });

export const addNewTask = (task: Task) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { task });

export const setTasksList = (tasks: Task[]) =>
  actionSpreader(TaskListAction.SET_TASKS_LIST, { tasks });

export const startTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.START_TASK, { taskId, action: 'start' });

export const updateTaskExecutionStatus = (taskId: Task['id'], data: any) =>
  actionSpreader(TaskListAction.UPDATE_TASK_EXECUTION_STATUS, {
    taskId,
    data,
  });

export const completeTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.COMPLETE_TASK, { taskId, action: 'complete' });

export const skipTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.SKIP_TASK, { taskId, action: 'skip' });
