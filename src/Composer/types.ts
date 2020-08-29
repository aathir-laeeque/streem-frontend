import { RouteComponentProps } from '@reach/router';

import { Job } from '../views/Jobs/types';
import {
  completeJob,
  fetchData,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  publishChecklist,
  resetComposer,
  startJob,
} from './actions';
import { Checklist } from './checklist.types';
import { StageListState } from './StageList/types';
import { TaskListState } from './TaskList/types';

export enum Entity {
  JOB = 'Job',
  CHECKLIST = 'checklist',
}

export enum JobStatus {
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
}

export type ComposerProps = RouteComponentProps<{
  id: Checklist['id'] | Job['id'];
}> & {
  entity: Entity;
};

export type ComposerState = {
  data?: Checklist | Job;
  entity?: Entity;
  loading: boolean;
  isJobStarted: boolean;
  jobStatus?: JobStatus;
  stages: StageListState;
  tasks: TaskListState;
};

export enum ComposerAction {
  FETCH_COMPOSER_DATA = '@@composer/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/FETCH_COMPOSER_DATA_SUCCESS',
  RESET_COMPOSER = '@@composer/RESET_COMPOSER',

  PUBLISH_CHECKLIST = '@@composer/PUBLISH_CHECKLIST',

  START_JOB = '@@composer/START_JOB',
  COMPLETE_JOB = '@@composer/COMPLETE_JOB',
  COMPLETE_JOB_WITH_EXCEPTION = '@@composer/COMPLETE_JOB_WITH_EXCEPTION',
}

export type ComposerActionType = ReturnType<
  | typeof fetchData
  | typeof fetchDataError
  | typeof fetchDataOngoing
  | typeof fetchDataSuccess
  | typeof resetComposer
  | typeof publishChecklist
  | typeof startJob
  | typeof completeJob
>;

export type FetchDataArgs = {
  id: Checklist['id'] | Job['id'];
  entity: Entity;
};
