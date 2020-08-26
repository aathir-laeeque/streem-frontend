import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction, UpdateTaskParams } from './types';

export const updateTask = (task: UpdateTaskParams) =>
  actionSpreader(TaskListAction.UPDATE_TASK, { task });

export const setTaskActive = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.SET_TASK_ACTIVE, { taskId });
