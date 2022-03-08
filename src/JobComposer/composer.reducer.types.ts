import { User } from '#store/users/types';
import { Job, JobStateType } from '#views/Jobs/NewListView/types';

import {
  completeJob,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  resetComposer,
  resetSignOffTaskError,
  setSignOffError,
  startJobSuccess,
} from './actions';
import { ActivityListState } from './ActivityList/reducer.types';
import { Entity } from './composer.types';
import { JobActivityState } from './JobActivity/types';
import { fetchActiveStageDataSuccess } from './StageList/actions';
import { StageListState } from './StageList/reducer.types';
import { TaskListState } from './TaskList/reducer.types';

export type ComposerState = {
  activities: ActivityListState;
  data?: Job;
  entity?: Entity;
  entityId?: Job['id'];
  loading: boolean;
  jobState: JobStateType;
  stages: StageListState;
  tasks: TaskListState;
  assignees: User[];
  activity: JobActivityState;
  signOffError?: string;
};

export enum ComposerAction {
  COMPLETE_JOB = '@@jobComposer/job-action/COMPLETE_JOB',
  COMPLETE_JOB_SUCCESS = '@@jobComposer/job-action/COMPLETE_JOB_SUCCESS',
  COMPLETE_JOB_WITH_EXCEPTION = '@@jobComposer/job-action/COMPLETE_JOB_WITH_EXCEPTION',
  COMPLETE_JOB_WITH_EXCEPTION_SUCCESS = '@@jobComposer/job-action/COMPLETE_JOB_WITH_EXCEPTION_SUCCESS',
  FETCH_COMPOSER_DATA = '@@jobComposer/composer-action/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@jobComposer/composer-action/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@jobComposer/composer-action/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@jobComposer/composer-action/FETCH_COMPOSER_DATA_SUCCESS',
  GET_SIGN_OFF_STATE = '@@jobComposer/job-action/GET_SIGN_OFF_STATE',
  RESET_COMPOSER = '@@jobComposer/composer-action/RESET_COMPOSER',
  SIGN_OFF_TASKS = '@@jobComposer/job-action/SIGN_OFF_TASKS',
  SIGN_OFF_TASKS_ERROR = '@@jobComposer/job-action/SIGN_OFF_TASKS_ERROR',
  SIGN_OFF_TASKS_ERROR_RESET = '@@jobComposer/job-action/SIGN_OFF_TASKS_ERROR_RESET',
  START_JOB = '@@jobComposer/job-action/START_JOB',
  START_JOB_SUCCESS = '@@jobComposer/job-action/START_JOB_SUCCESS',
}

export type ComposerActionType = ReturnType<
  | typeof completeJob
  | typeof fetchActiveStageDataSuccess
  | typeof fetchDataError
  | typeof fetchDataOngoing
  | typeof fetchDataSuccess
  | typeof resetComposer
  | typeof resetSignOffTaskError
  | typeof setSignOffError
  | typeof startJobSuccess
>;
