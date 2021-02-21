import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import { Checklist } from '#PrototypeComposer/checklist.types';

import {
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';

type JobProperties = {
  [key: string]: string | null;
};

export type Job = {
  checklist: Checklist;
  code: string;
  completedTasks: number;
  id: string;
  // properties: {
  //   'BATCH NO': string;
  //   'PRODUCT MANUFACTURED': string;
  //   'ROOM ID': string;
  // }[];
  properties: JobProperties[] | JobProperties | any;
  state: JobStateType;
  totalTasks: number;
  name?: string;
  assignees: User[];
};

export type ListViewProps = RouteComponentProps;

export enum AssignedJobStates {
  ASSIGNED = 'ASSIGNED',
  BLOCKED = 'BLOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum UnassignedJobStates {
  UNASSIGNED = 'UNASSIGNED',
}

export enum CompletedJobStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
}

export type JobStateType =
  | AssignedJobStates
  | UnassignedJobStates
  | CompletedJobStates;

export const JobStateEnum = {
  ...AssignedJobStates,
  ...UnassignedJobStates,
  ...CompletedJobStates,
};

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
  CREATE_JOB = '@@job/ListView/CREATE_JOB',
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
