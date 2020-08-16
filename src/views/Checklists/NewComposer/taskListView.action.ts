import { actionSpreader } from '#store/helpers';

import { Task } from './checklist.types';
import { TaskListAction } from './taskListView.types';

export const setTasks = (tasks: Task[]) =>
  actionSpreader(TaskListAction.SET_TASKS, { tasks });
