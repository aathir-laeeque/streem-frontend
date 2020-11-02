import { actionSpreader } from '#store';

import { User, Users } from '#store/users/types';
import { Task } from '../checklist.types';
import { TaskAction } from './types';
import { TaskListAction } from './reducer.types';
import { Job } from '#views/Jobs/types';

export const setActiveTask = (id: Task['id'], bringIntoView = false) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { id, bringIntoView });

export const startTask = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.START_TASK, {
    taskId,
    action: TaskAction.START,
  });

export const updateTaskExecutionState = (taskId: Task['id'], data: any) =>
  actionSpreader(TaskListAction.UPDATE_TASK_EXECUTION_STATE, {
    taskId,
    data,
  });

export const completeTask = (
  taskId: Task['id'],
  reason?: string,
  withException?: boolean,
) =>
  actionSpreader(
    withException
      ? TaskListAction.COMPLETE_TASK_WITH_EXCEPTION
      : TaskListAction.COMPLETE_TASK,
    {
      reason,
      taskId,
      action: withException
        ? TaskAction.COMPLETE_WITH_EXCEPTION
        : TaskAction.COMPLETE,
    },
  );

export const skipTask = (taskId: Task['id'], reason: string) =>
  actionSpreader(TaskListAction.SKIP_TASK, {
    reason,
    taskId,
    action: TaskAction.SKIP,
  });

export const setTaskError = (error: any, taskId: Task['id']) =>
  actionSpreader(TaskListAction.SET_TASK_ERROR, { error, taskId });

export const assignUserToTask = (user: User, taskId: Task['id']) =>
  actionSpreader(TaskListAction.ASSIGN_USER_TO_TASK, { user, taskId });

export const unAssignUserFromTask = (user: User, taskId: Task['id']) =>
  actionSpreader(TaskListAction.UNASSIGN_USER_FROM_TASK, { user, taskId });

export const revertUsersForTask = (users: Users, taskId: Task['id']) =>
  actionSpreader(TaskListAction.REVERT_USERS_FOR_TASK, { users, taskId });

export const assignUsersToTask = (payload: {
  jobId: Job['id'];
  taskId: Task['id'];
  assignIds: User['id'][];
  unassignIds: User['id'][];
  preAssigned: Users;
  notify: boolean;
}) => actionSpreader(TaskListAction.ASSIGN_USERS_TO_TASK, payload);

export const enableErrorCorrection = (
  taskId: Task['id'],
  correctionReason: string,
) =>
  actionSpreader(TaskListAction.ENABLE_TASK_ERROR_CORRECTION, {
    taskId,
    correctionReason,
  });

export const completeErrorCorretcion = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.COMPLTE_ERROR_CORRECTION, { taskId });

export const cancelErrorCorretcion = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.CANCEL_ERROR_CORRECTION, { taskId });
