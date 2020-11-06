import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';

import {
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';

export type Job = {
  checklist: {
    id: string;
    name: string;
    properties: {
      'EQUIPMENT ID': string;
      'SOP NO': string;
      TYPE: string;
    };
  };
  code: string;
  completedTasks: number;
  id: string;
  properties: {
    'BATCH NO': string;
    'PRODUCT MANUFACTURED': string;
    'ROOM ID': string;
  };
  state: JobState;
  totalTasks: number;
};

export type ListViewProps = RouteComponentProps;

export enum AssignedJobStates {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum UnassignedJobStates {
  UNASSIGNED = 'UNASSIGNED',
}

export enum CompletedJobStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
}

export type JobState =
  | AssignedJobStates
  | UnassignedJobStates
  | CompletedJobStates;

export interface ListViewState {
  readonly jobs: Job[];
  readonly loading: boolean;
  readonly error: any;
  readonly pageable: Pageable;
}

export enum ListViewAction {
  FETCH_JOBS = '@@job/New-ListView/FETCH_JOBS',
  FETCH_JOBS_ERROR = '@@job/New-ListView/FETCH_JOBS_ERROR',
  FETCH_JOBS_ONGOING = '@@job/New-ListView/FETCH_JOBS_ONGOING',
  FETCH_JOBS_SUCCESS = '@@job/New-ListView/FETCH_JOBS_SUCCESS',
}

export type ListViewActionType = ReturnType<
  | typeof fetchJobs
  | typeof fetchJobsError
  | typeof fetchJobsOngoing
  | typeof fetchJobsSuccess
>;

export type fetchDataArgs = {
  page?: number;
  size?: number;
};

export type fetchJobsArgs = {
  page: number;
  size: number;
  filters: string;
  sort: string;
};

export type fetchJobsSuccessArgs = {
  data: Job[];
  pageable: Pageable;
};
