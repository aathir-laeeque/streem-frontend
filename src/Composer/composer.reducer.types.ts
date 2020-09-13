import { Job } from '../views/Jobs/types';
import {
  completeJob,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  resetComposer,
  startJobSuccess,
} from './actions';
import { ActivityListActionType } from './ActivityList/types';
import { Activity, Checklist, Stage, Task } from './checklist.types';
import { Entity, JobStatus } from './composer.types';
import { StageListActionType, StageListState } from './StageList/types';
import { TaskListActionType } from './TaskList/types';

export type ActivitiesById = Record<Activity['id'], Activity>;
export type ActivitiesOrderInTaskInStage = Record<
  Stage['id'],
  Record<Task['id'], Activity['id'][]>
>;

// removes tasks from stages
// export type StagesById = Record<Stage['id'], Omit<Stage, 'tasks'>>;
// export type StagesOrder = Stage['id'][];

// removes activities from tasks
export type TasksById = Record<
  Task['id'],
  Omit<Task, 'activities'> & { hasError?: boolean; errorMessage?: string }
>;
export type TasksOrderInStage = Record<Stage['id'], Task['id'][]>;

export type ComposerState = {
  // activeStageId: Stage['id'];
  // activeTaskId: Task['id'];

  // activitiesById: ActivitiesById;
  // activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage;

  data?: Checklist | Job;

  entity?: Entity;
  entityId?: Checklist['id'] | Job['id'];

  loading: boolean;

  jobStatus: JobStatus;

  // stagesById: StagesById;
  // stagesOrder: StagesOrder;

  // tasksById: TasksById;
  // tasksOrderInStage: TasksOrderInStage;
} & StageListState;

export enum ComposerAction {
  COMPLETE_JOB = '@@composer/job-action/COMPLETE_JOB',
  COMPLETE_JOB_SUCCESS = '@@composer/job-action/COMPLETE_JOB_SUCCESS',
  COMPLETE_JOB_WITH_EXCEPTION = '@@composer/job-action/COMPLETE_JOB_WITH_EXCEPTION',
  COMPLETE_JOB_WITH_EXCEPTION_SUCCESS = '@@composer/job-action/COMPLETE_JOB_WITH_EXCEPTION_SUCCESS',

  FETCH_COMPOSER_DATA = '@@composer/composer-action/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/composer-action/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/composer-action/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/composer-action/FETCH_COMPOSER_DATA_SUCCESS',

  RESET_COMPOSER = '@@composer/composer-action/RESET_COMPOSER',

  START_JOB = '@@composer/job-action/START_JOB',
  START_JOB_SUCCESS = '@@composer/job-action/START_JOB_SUCCESS',
}

export type ComposerActionType = ReturnType<
  | typeof fetchDataError
  | typeof fetchDataOngoing
  | typeof fetchDataSuccess
  | typeof resetComposer
  | typeof startJobSuccess
  | typeof completeJob
>;

// export type ComposerActionType =
//   | ReturnType<ComposerActionType1>
//   // | StageListActionType
//   | TaskListActionType
//   | ActivityListActionType;
