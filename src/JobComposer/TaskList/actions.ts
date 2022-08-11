import { actionSpreader } from '#store';
import { AutomationAction, Task } from '../checklist.types';
import { TaskListAction } from './reducer.types';
import { TaskAction } from './types';

export const setActiveTask = (id: Task['id'], bringIntoView = false) =>
  actionSpreader(TaskListAction.SET_ACTIVE_TASK, { id, bringIntoView });

export const startTask = (
  taskId: Task['id'],
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  actionSpreader(TaskListAction.START_TASK, {
    taskId,
    setLoadingState,
    action: TaskAction.START,
  });

export const updateTaskExecutionState = (taskId: Task['id'], data: any) =>
  actionSpreader(TaskListAction.UPDATE_TASK_EXECUTION_STATE, {
    taskId,
    data,
  });

export const completeTask = ({
  taskId,
  setLoadingState,
  reason,
  withException,
  automations,
}: {
  taskId: Task['id'];
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  reason?: string;
  withException?: boolean;
  automations?: AutomationAction[];
}) =>
  actionSpreader(
    withException ? TaskListAction.COMPLETE_TASK_WITH_EXCEPTION : TaskListAction.COMPLETE_TASK,
    {
      reason,
      taskId,
      setLoadingState,
      automations,
      action: withException ? TaskAction.COMPLETE_WITH_EXCEPTION : TaskAction.COMPLETE,
    },
  );

export const skipTask = (
  taskId: Task['id'],
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
  reason: string,
) =>
  actionSpreader(TaskListAction.SKIP_TASK, {
    reason,
    taskId,
    setLoadingState,
    action: TaskAction.SKIP,
  });

export const setTaskError = (error: any, taskId: Task['id']) =>
  actionSpreader(TaskListAction.SET_TASK_ERROR, { error, taskId });

export const removeTaskError = (taskId: Task['id']) =>
  actionSpreader(TaskListAction.REMOVE_TASK_ERROR, { taskId });

export const enableErrorCorrection = (
  taskId: Task['id'],
  correctionReason: string,
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  actionSpreader(TaskListAction.ENABLE_TASK_ERROR_CORRECTION, {
    taskId,
    correctionReason,
    setLoadingState,
  });

export const completeErrorCorretcion = (
  taskId: Task['id'],
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  actionSpreader(TaskListAction.COMPLTE_ERROR_CORRECTION, {
    taskId,
    setLoadingState,
  });

export const cancelErrorCorretcion = (
  taskId: Task['id'],
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
) =>
  actionSpreader(TaskListAction.CANCEL_ERROR_CORRECTION, {
    taskId,
    setLoadingState,
  });
