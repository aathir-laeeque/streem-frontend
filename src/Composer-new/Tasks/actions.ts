import { actionSpreader } from '#store/helpers';

import { Task, Stage } from '../checklist.types';
import { TaskListActions } from './reducer.types';
import { AddNewTaskArgs } from './types';

export const addNewTask = ({ checklistId, stageId }: AddNewTaskArgs) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK, { checklistId, stageId });

export const addNewTaskError = (error: any) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK_ERROR, { error });

export const addNewTaskSuccess = (newTask: Task, stageId: Stage['id']) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK_SUCCESS, { newTask, stageId });

export const deleteTask = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.DELETE_TASK, { taskId });

export const deleteTaskError = (error: any) =>
  actionSpreader(TaskListActions.DELETE_TASK_ERROR, { error });

export const deleteTaskSuccess = (taskId: Task['id'], stageId: Stage['id']) =>
  actionSpreader(TaskListActions.DELETE_TASK_SUCCESS, { taskId, stageId });

export const setActiveTask = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.SET_ACTIVE_TASK, { taskId });
