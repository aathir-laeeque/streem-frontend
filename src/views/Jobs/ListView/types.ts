import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';

import { Job } from '../types';
import {
  assignUser,
  assignUserError,
  createJob,
  createJobError,
  createJobOngoing,
  createJobSuccess,
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
  setSelectedStatus,
  unAssignUser,
  unAssignUserError,
} from './actions';

type TabContentProps = Record<string, any>;
export type ListViewProps = RouteComponentProps;
export type TabViewProps = RouteComponentProps<TabContentProps>;

export type Jobs = Record<
  string,
  {
    list: Job[] | [];
    pageable: Pageable;
  }
>;
export interface ListViewState {
  readonly jobs: Jobs;
  readonly loading: boolean;
  readonly error: any;
  readonly selectedStatus: string;
}

export enum JobStatus {
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
  COMPLETED = 'completed',
}

export enum ListViewAction {
  FETCH_JOBS = '@@job/ListView/FETCH_JOBS',
  FETCH_JOBS_ERROR = '@@job/ListView/FETCH_JOBS_ERROR',
  FETCH_JOBS_ONGOING = '@@job/ListView/FETCH_JOBS_ONGOING',
  FETCH_JOBS_SUCCESS = '@@job/ListView/FETCH_JOBS_SUCCESS',
  CREATE_JOB = '@@job/ListView/CREATE_JOB',
  CREATE_JOB_ERROR = '@@job/ListView/CREATE_JOB_ERROR',
  CREATE_JOB_ONGOING = '@@job/ListView/CREATE_JOB_ONGOING',
  CREATE_JOB_SUCCESS = '@@job/ListView/CREATE_JOB_SUCCESS',
  SET_SELECTED_STATUS = '@@job/ListView/SET_SELECTED_STATUS',
  ASSIGN_USER = '@@job/ListView/ASSIGN_USER',
  ASSIGN_USER_ERROR = '@@job/ListView/ASSIGN_USER_ERROR',
  UNASSIGN_USER = '@@job/ListView/UNASSIGN_USER',
  UNASSIGN_USER_ERROR = '@@job/ListView/UNASSIGN_USER_ERROR',
}

export type ListViewActionType = ReturnType<
  | typeof fetchJobs
  | typeof fetchJobsError
  | typeof fetchJobsOngoing
  | typeof fetchJobsSuccess
  | typeof createJob
  | typeof createJobOngoing
  | typeof createJobSuccess
  | typeof createJobError
  | typeof setSelectedStatus
  | typeof assignUser
  | typeof assignUserError
  | typeof unAssignUser
  | typeof unAssignUserError
>;
