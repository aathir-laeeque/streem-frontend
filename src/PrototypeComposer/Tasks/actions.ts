import { actionSpreader } from '#store/helpers';
import { Error } from '#utils/globalTypes';

import { Stage, Task } from '../checklist.types';
import { TaskListActions } from './reducer.types';
import { AddMediaArgs, AddNewTaskArgs, SetTaskTimerArgs } from './types';

export const addNewTask = ({ checklistId, stageId }: AddNewTaskArgs) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK, { checklistId, stageId });

export const addNewTaskSuccess = (newTask: Task, stageId: Stage['id']) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK_SUCCESS, { newTask, stageId });

export const addTaskMedia = ({ mediaDetails, taskId }: AddMediaArgs) =>
  actionSpreader(TaskListActions.ADD_TASK_MEDIA, { mediaDetails, taskId });

export const addStop = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.ADD_STOP, { taskId });

export const deleteTask = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.DELETE_TASK, { taskId });

export const deleteTaskSuccess = (
  taskId: Task['id'],
  stageId: Stage['id'],
  newOrderMap?: Record<string, number>,
) =>
  actionSpreader(TaskListActions.DELETE_TASK_SUCCESS, {
    taskId,
    stageId,
    newOrderMap,
  });

export const removeStop = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.REMOVE_STOP, { taskId });

export const setActiveTask = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.SET_ACTIVE_TASK, { taskId });

export const setTaskError = (error: any) =>
  actionSpreader(TaskListActions.SET_TASK_ERROR, { error });

export const setTaskTimer = (setTimerArgs: SetTaskTimerArgs) =>
  actionSpreader(TaskListActions.SET_TASK_TIMER, { ...setTimerArgs });

export const removeTaskTimer = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.REMOVE_TASK_TIMER, { taskId });

export const updateTask = (task: Task) =>
  actionSpreader(TaskListActions.UPDATE_TASK, { task });

export const updateTaskName = (task: Pick<Task, 'name' | 'id'>) =>
  actionSpreader(TaskListActions.UPDATE_TASK_NAME, { task });

export const setValidationError = (error: Error) =>
  actionSpreader(TaskListActions.SET_VALIDATION_ERROR, { error });

export const resetTaskActivityError = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.RESET_TASK_ACTIVITY_ERROR, { taskId });

export const removeTaskMedia = (taskId: Task['id'], mediaId: string) =>
  actionSpreader(TaskListActions.REMOVE_TASK_MEDIA, { taskId, mediaId });
