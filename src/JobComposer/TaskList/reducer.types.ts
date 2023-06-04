import {
  executeParameter,
  executeParameterLeading,
  fixParameter,
  fixParameterLeading,
} from '../ActivityList/actions';
import { Stage, Task } from '../checklist.types';
import { ComposerActionType } from '../composer.reducer.types';
import { setActiveStage } from '../StageList/actions';
import {
  removeTaskError,
  setActiveTask,
  setTaskError,
  updateTaskExecutionDurationOnResume,
  updateTaskExecutionState,
  updateTaskOrderList,
} from './actions';
import { TasksById, TasksOrderInStage } from './types';

export type TaskListState = {
  activeTaskId?: Task['id'];
  bringIntoView: boolean;
  tasksById: TasksById;
  taskIdWithStop?: Task['id'];
  tasksOrderInStage: TasksOrderInStage;
  stageIdWithTaskStop?: Stage['id'];
  tasksOrderList: Record<string, string>[];
};

export enum TaskListAction {
  SET_ACTIVE_TASK = '@@jobComposer/task-list/SET_ACTIVE_TASK',
  SET_ACTIVE_SUB_TASK = '@@jobComposer/task-list/SET_ACTIVE_SUB_TASK',

  START_TASK = '@@jobComposer/task-list/task/START_TASK',
  COMPLETE_TASK = '@@jobComposer/task-list/task/COMPLETE_TASK',
  COMPLETE_TASK_WITH_EXCEPTION = '@@jobComposer/task-list/task/COMPLETE_TASK_WITH_EXCEPTION',
  SKIP_TASK = '@@jobComposer/task-list/task/SKIP_TASK',

  UPDATE_TASK_EXECUTION_STATE = '@@jobComposer/task-list/task/UPDATE_TASK_EXECUTION_STATE',

  SET_TASK_ERROR = '@@jobComposer/task-list/task/SET_TASK_ERROR',
  REMOVE_TASK_ERROR = '@@jobComposer/task-list/task/REMOVE_TASK_ERROR',

  ENABLE_TASK_ERROR_CORRECTION = '@@jobComposer/task-list/task/ENABLE_TASK_ERROR_CORRECTION',
  CANCEL_ERROR_CORRECTION = '@@jobComposer/task-list/task/CANCEL_ERROR_CORRECTION',
  COMPLETE_ERROR_CORRECTION = '@@jobComposer/task-list/task/COMPLETE_ERROR_CORRECTION',
  UPDATE_TASK_EXECUTION_DURATION = '@@jobComposer/task-list/task/UPDATE_TASK_EXECUTION_DURATION',
  UPDATE_TASK_ORDER_LIST = '@@jobComposer/task-list/task/UPDATE_TASK_ORDER_LIST',
}

export type TaskListActionType =
  | ReturnType<
      | typeof setActiveTask
      | typeof setTaskError
      | typeof updateTaskExecutionState
      | typeof removeTaskError
      | typeof updateTaskExecutionDurationOnResume
      | typeof updateTaskOrderList
    >
  | ReturnType<
      | typeof executeParameter
      | typeof fixParameter
      | typeof executeParameterLeading
      | typeof fixParameterLeading
    >
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
