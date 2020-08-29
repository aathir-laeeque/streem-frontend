import { actionSpreader } from '#store';

import { Task } from '../checklist.types';
import { TaskListAction } from './types';

export const setActiveTask = (id: Task['id']) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { id });

export const addNewTask = (task: Task) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { task });

export const setTasksList = (tasks: Task[]) =>
  actionSpreader(TaskListAction.SET_TASKS_LIST, { tasks });
