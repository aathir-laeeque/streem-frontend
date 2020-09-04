import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction, TaskAction } from './types';

export const setActiveTask = (id: Task['id']) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { id });

export const startTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.START_TASK, {
    taskId,
    action: TaskAction.START,
  });

export const updateTaskExecutionStatus = (taskId: Task['id'], data: any) =>
  actionSpreader(TaskListAction.UPDATE_TASK_EXECUTION_STATUS, {
    taskId,
    data,
  });

export const completeTask = (taskId: Task['id'], delayReason?: string) =>
  actionSpreader(TaskListAction.COMPLETE_TASK, {
    delayReason,
    taskId,
    action: TaskAction.COMPLETE,
  });

export const skipTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.SKIP_TASK, { taskId, action: TaskAction.SKIP });

export const setTaskError = (error: any, taskId: Task['id']) =>
  actionSpreader(TaskListAction.SET_TASK_ERROR, { error, taskId });
