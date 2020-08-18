import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction, SetActiveTaskArguments } from './types';

export const setTasks = (tasks: Task[]) =>
  actionSpreader(TaskListAction.SET_TASKS, { tasks });

export const setTaskActive = (taskId: SetActiveTaskArguments) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { taskId });
