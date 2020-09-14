import { Job } from '../views/Jobs/types';
import {
  completeJob,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  resetComposer,
  startJobSuccess,
} from './actions';
import { ActivityListState } from './ActivityList/reducer.types';
import { Checklist } from './checklist.types';
import { Entity, JobStatus } from './composer.types';
import { StageListState } from './StageList/reducer.types';
import { TaskListState } from './TaskList/reducer.types';

export type ComposerState = {
  activities: ActivityListState;

  data?: Checklist | Job;

  entity?: Entity;
  entityId?: Checklist['id'] | Job['id'];

  loading: boolean;

  jobStatus: JobStatus;

  stages: StageListState;

  tasks: TaskListState;
};

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
