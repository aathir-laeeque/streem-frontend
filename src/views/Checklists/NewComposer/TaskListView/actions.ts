import { actionSpreader } from '#store';

import { Task, Stage } from '../checklist.types';
import { TaskListAction } from './types';

export const setTasks = (
  tasks: Task[],
  stageName: Stage['name'],
  stageOrderTree: Stage['orderTree'],
) =>
  actionSpreader(TaskListAction.SET_TASKS, {
    tasks,
    stageName,
    stageOrderTree,
  });

export const updateTask = (task: Task) =>
  actionSpreader(TaskListAction.UPDATE_TASK, { task });
