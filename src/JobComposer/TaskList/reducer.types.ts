import { executeActivity, fixActivity } from '../ActivityList/actions';
import { Stage, Task } from '../checklist.types';
import { ComposerActionType } from '../composer.reducer.types';
import { setActiveStage } from '../StageList/actions';
import {
  assignUserToTask,
  removeTaskError,
  revertUsersForTask,
  setActiveTask,
  setTaskError,
  unAssignUserFromTask,
  updateTaskExecutionState,
} from './actions';
import { TasksById, TasksOrderInStage } from './types';

export type TaskListState = {
  activeTaskId?: Task['id'];

  bringIntoView: boolean;

  tasksById: TasksById;
  taskIdWithStop?: Task['id'];
  tasksOrderInStage: TasksOrderInStage;

  stageIdWithTaskStop?: Stage['id'];
};

export enum TaskListAction {
  SET_ACTIVE_TASK = '@@composer/task-list/SET_ACTIVE_TASK',

  START_TASK = '@@composer/task-list/task/START_TASK',
  COMPLETE_TASK = '@@composer/task-list/task/COMPLETE_TASK',
  COMPLETE_TASK_WITH_EXCEPTION = '@@composer/task-list/task/COMPLETE_TASK_WITH_EXCEPTION',
  SKIP_TASK = '@@composer/task-list/task/SKIP_TASK',

  UPDATE_TASK_EXECUTION_STATE = '@@composer/task-list/task/UPDATE_TASK_EXECUTION_STATE',

  SET_TASK_ERROR = '@@composer/task-list/task/SET_TASK_ERROR',
  REMOVE_TASK_ERROR = '@@composer/task-list/task/REMOVE_TASK_ERROR',

  ENABLE_TASK_ERROR_CORRECTION = '@@composer/task-list/task/ENABLE_TASK_ERROR_CORRECTION',
  CANCEL_ERROR_CORRECTION = '@@composer/task-list/task/CANCEL_ERROR_CORRECTION',
  COMPLTE_ERROR_CORRECTION = '@@composer/task-list/task/COMPLTE_ERROR_CORRECTION',
  ASSIGN_USER_TO_TASK = '@@composer/task-list/task/ASSIGN_USER_TO_TASK',
  UNASSIGN_USER_FROM_TASK = '@@composer/task-list/task/UNASSIGN_USER_FROM_TASK',
  REVERT_USERS_FOR_TASK = '@@composer/task-list/task/REVERT_USERS_FOR_TASK',
  ASSIGN_USERS_TO_TASK = '@@composer/task-list/task/ASSIGN_USERS_TO_TASK',
  ASSIGN_USERS_TO_TASK_ERROR = '@@composer/task-list/task/ASSIGN_USERS_TO_TASK_ERROR',
}

export type TaskListActionType =
  | ReturnType<
      | typeof setActiveTask
      | typeof setTaskError
      | typeof updateTaskExecutionState
      | typeof removeTaskError
    >
  | ReturnType<typeof revertUsersForTask>
  | ReturnType<typeof unAssignUserFromTask>
  | ReturnType<typeof assignUserToTask>
  | ReturnType<typeof executeActivity | typeof fixActivity>
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
