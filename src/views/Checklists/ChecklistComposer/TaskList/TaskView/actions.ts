import { actionSpreader } from '#store';

import { TaskViewAction, Task, updateParams } from './types';

export const setActiveTask = (taskId: Task['id']) =>
  actionSpreader(TaskViewAction.SET_ACTIVE_TASK, { taskId });

export const updateTask = (task: updateParams & { id: Task['id'] }) =>
  actionSpreader(TaskViewAction.UPDATE_TASK, { task });

export const completeTask = (taskId: Task['id']) =>
  actionSpreader(TaskViewAction.COMPLETE_TASK, { taskId });
