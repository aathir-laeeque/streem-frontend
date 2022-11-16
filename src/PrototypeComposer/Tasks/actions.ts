import { AutomationAction } from '#JobComposer/checklist.types';
import { ReOrderType } from '#PrototypeComposer/types';
import { actionSpreader } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import { Media, Stage, Task } from '../checklist.types';
import { TaskListActions } from './reducer.types';
import {
  AddActionType,
  AddMediaType,
  AddNewTaskType,
  ArchiveActionType,
  SetTaskTimerType,
  UpdateActionType,
  UpdateMediaType,
} from './types';

export const addNewTask = ({ checklistId, stageId }: AddNewTaskType) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK, { checklistId, stageId });

export const addNewTaskSuccess = (newTask: Task, stageId: Stage['id']) =>
  actionSpreader(TaskListActions.ADD_NEW_TASK_SUCCESS, { newTask, stageId });

export const addTaskMedia = ({ mediaDetails, taskId }: AddMediaType) =>
  actionSpreader(TaskListActions.ADD_TASK_MEDIA, { mediaDetails, taskId });

export const updateTaskMedia = (payload: UpdateMediaType) =>
  actionSpreader(TaskListActions.UPDATE_TASK_MEDIA, payload);

export const updateTaskMediaSuccess = (payload: { media: Media; taskId: Task['id'] }) =>
  actionSpreader(TaskListActions.UPDATE_TASK_MEDIA_SUCCESS, payload);

export const addStop = (taskId: Task['id']) => actionSpreader(TaskListActions.ADD_STOP, { taskId });

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

export const setTaskTimer = (setTimerType: SetTaskTimerType) =>
  actionSpreader(TaskListActions.SET_TASK_TIMER, { ...setTimerType });

export const removeTaskTimer = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.REMOVE_TASK_TIMER, { taskId });

export const updateTask = (task: Task) => actionSpreader(TaskListActions.UPDATE_TASK, { task });

export const updateTaskName = (task: Pick<Task, 'name' | 'id'>) =>
  actionSpreader(TaskListActions.UPDATE_TASK_NAME, { task });

export const setValidationError = (error: Error) =>
  actionSpreader(TaskListActions.SET_VALIDATION_ERROR, { error });

export const resetTaskActivityError = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.RESET_TASK_ACTIVITY_ERROR, { taskId });

export const resetTaskError = (taskId: Task['id']) =>
  actionSpreader(TaskListActions.RESET_TASK_ERROR, { taskId });

export const removeTaskMedia = (taskId: Task['id'], mediaId: string) =>
  actionSpreader(TaskListActions.REMOVE_TASK_MEDIA, { taskId, mediaId });

// reorder stage actions
export const reOrderTask = ({
  from,
  id,
  to,
  activeStageId,
}: ReOrderType & { activeStageId: string }) =>
  actionSpreader(TaskListActions.REORDER_TASK, { from, id, to, activeStageId });

export const reOrderTaskError = (error: any) =>
  actionSpreader(TaskListActions.REORDER_TASK_ERROR, { error });

export const reOrderTaskSuccess = ({
  from,
  id,
  to,
  activeStageId,
}: ReOrderType & { activeStageId: string }) =>
  actionSpreader(TaskListActions.REORDER_TASK_SUCCESS, {
    from,
    id,
    to,
    activeStageId,
  });

export const addTaskAction = (payload: AddActionType) =>
  actionSpreader(TaskListActions.ADD_TASK_ACTION, payload);

export const updateTaskAction = (payload: UpdateActionType) =>
  actionSpreader(TaskListActions.UPDATE_TASK_ACTION, payload);

export const updateTaskActionSuccess = (payload: {
  action: AutomationAction;
  taskId: Task['id'];
}) => actionSpreader(TaskListActions.UPDATE_TASK_ACTION_SUCCESS, payload);

export const archiveTaskAction = (payload: ArchiveActionType) =>
  actionSpreader(TaskListActions.ARCHIVE_TASK_ACTION, payload);

export const reOrderActivities = (payload: {
  checklistId: string;
  taskId: string;
  stageId: string;
  orderedIds: string[];
}) => actionSpreader(TaskListActions.REORDER_ACTIVITIES, payload);
