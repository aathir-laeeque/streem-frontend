import { actionSpreader } from '#store';

import { Stage } from '../StageList/types';
import { TaskListAction, TasksById } from './types';

export const setTasks = (
  tasks: TasksById,
  { orderTree, name }: Pick<Stage, 'orderTree' | 'name'>,
) => actionSpreader(TaskListAction.SET_TASKS, { tasks, orderTree, name });
