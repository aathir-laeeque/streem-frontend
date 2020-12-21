import { User } from '#store/users/types';
import { Job } from '../views/Jobs/types';
import {
  completeJob,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  resetComposer,
  startJobSuccess,
  fetchAssignedUsersForJob,
  fetchAssignedUsersForJobError,
  fetchAssignedUsersForJobSuccess,
  assignUserToJob,
  unAssignUserFromJob,
  assignUsersToJobSuccess,
  revertUsersForJob,
} from './actions';
import { ActivityListState } from './ActivityList/reducer.types';
import { Checklist } from './checklist.types';
import { Entity, JobState } from './composer.types';
import { JobActivityState } from './JobActivity/types';
import { StageListState } from './StageList/reducer.types';
import { TaskListState } from './TaskList/reducer.types';
import { setSignOffError, resetSignOffTaskError } from './actions';

export type ComposerState = {
  activities: ActivityListState;

  data?: Checklist | Job;

  entity?: Entity;
  entityId?: Checklist['id'] | Job['id'];

  loading: boolean;

  jobState: JobState;

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

  RESET_COMPOSER = '@@jobComposer/composer-action/RESET_COMPOSER',

  START_JOB = '@@jobComposer/job-action/START_JOB',
  START_JOB_SUCCESS = '@@jobComposer/job-action/START_JOB_SUCCESS',

  FETCH_ASSIGNED_USERS_FOR_JOB = '@@jobComposer/job-action/FETCH_ASSIGNED_USERS_FOR_JOB',
  FETCH_ASSIGNED_USERS_FOR_JOB_ERROR = '@@jobComposer/job-action/FETCH_ASSIGNED_USERS_FOR_JOB_ERROR',
  FETCH_ASSIGNED_USERS_FOR_JOB_SUCCESS = '@@jobComposer/job-action/FETCH_ASSIGNED_USERS_FOR_JOB_SUCCESS',
  ASSIGN_USERS_TO_JOB = '@@jobComposer/job-action/ASSIGN_USERS_TO_JOB',
  UNASSIGN_USER_FROM_JOB = '@@jobComposer/job-action/UNASSIGN_USER_FROM_JOB',
  ASSIGN_USER_TO_JOB = '@@jobComposer/job-action/ASSIGN_USER_TO_JOB',
  ASSIGN_USERS_TO_JOB_SUCCESS = '@@jobComposer/job-action/ASSIGN_USERS_TO_JOB_SUCCESS',
  ASSIGN_USERS_TO_JOB_ERROR = '@@jobComposer/job-action/ASSIGN_USERS_TO_JOB_ERROR',
  REVERT_USERS_FOR_JOB = '@@jobComposer/job-action/REVERT_USERS_FOR_JOB',

  GET_SIGN_OFF_STATE = '@@jobComposer/job-action/GET_SIGN_OFF_STATE',
  SIGN_OFF_TASKS = '@@jobComposer/job-action/SIGN_OFF_TASKS',
  SIGN_OFF_TASKS_ERROR = '@@jobComposer/job-action/SIGN_OFF_TASKS_ERROR',
  SIGN_OFF_TASKS_ERROR_RESET = '@@jobComposer/job-action/SIGN_OFF_TASKS_ERROR_RESET',

  START_JOB_STATE_POLLING = '@@jobComposer/job-action/START_JOB_STATE_POLLING',
  STOP_JOB_STATE_POLLING = '@@jobComposer/job-action/STOP_JOB_STATE_POLLING',
}

export type ComposerActionType = ReturnType<
  | typeof fetchAssignedUsersForJob
  | typeof fetchAssignedUsersForJobError
  | typeof fetchAssignedUsersForJobSuccess
  | typeof fetchDataError
  | typeof fetchDataOngoing
  | typeof fetchDataSuccess
  | typeof resetComposer
  | typeof startJobSuccess
  | typeof completeJob
  | typeof assignUserToJob
  | typeof unAssignUserFromJob
  | typeof assignUsersToJobSuccess
  | typeof revertUsersForJob
  | typeof setSignOffError
  | typeof resetSignOffTaskError
>;
