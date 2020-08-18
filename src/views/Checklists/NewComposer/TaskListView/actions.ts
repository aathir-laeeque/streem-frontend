import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction } from './types';

export const setTasks = (tasks: Task[]) =>
  actionSpreader(TaskListAction.SET_TASKS, { tasks });
