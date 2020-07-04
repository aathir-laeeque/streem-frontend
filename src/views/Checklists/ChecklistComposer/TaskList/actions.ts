import { Task } from './StepView/types';
import { actionSpreader } from '#store';

import { TaskListAction, TasksById } from './types';

export const setTasks = (tasks: TasksById) =>
  actionSpreader(TaskListAction.SET_TASKS, { tasks });

export const setActiveTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { taskId });
