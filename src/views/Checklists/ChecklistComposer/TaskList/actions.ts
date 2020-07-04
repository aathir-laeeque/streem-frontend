import { actionSpreader } from '#store';

import { TaskListAction, TasksById } from './types';

export const setTasks = (tasks: TasksById) =>
  actionSpreader(TaskListAction.SET_TASKS, { tasks });
