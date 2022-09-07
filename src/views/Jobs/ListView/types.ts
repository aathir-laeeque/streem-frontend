import { Checklist } from '#PrototypeComposer/checklist.types';
import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import { fetchJobs, fetchJobsError, fetchJobsOngoing, fetchJobsSuccess } from './actions';

export type Assignee = Pick<User, 'employeeId' | 'firstName' | 'id' | 'lastName'> & {
  jobId: string;
};

export type JobRelationTarget = {
  id: string;
  externalId: string;
  displayName: string;
  collection: string;
};

export type JobRelation = {
  id: string;
  externalId: string;
  displayName: string;
  targets: JobRelationTarget[];
};

// TODO properties as null seems unnecessary here consider removing it
export type Job = {
  checklist: Checklist;
  code: string;
  completedTasks: number;
  id: string;
  properties: Pick<Property, 'id' | 'name' | 'label' | 'value'>[] | null;
  state: JobStateType;
  totalTasks: number;
  name?: string;
  assignees: Assignee[];
  relations: JobRelation[];
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

export type JobStateType = AssignedJobStates | UnassignedJobStates | CompletedJobStates;

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
  typeof fetchJobs | typeof fetchJobsError | typeof fetchJobsOngoing | typeof fetchJobsSuccess
>;

export type fetchDataType = {
  page?: number;
  size?: number;
};

export type fetchJobsType = {
  facilityId?: string;
  page: number;
  size: number;
  filters: string;
  sort: string;
};

export type fetchJobsSuccessType = {
  data: Job[];
  pageable: Pageable;
};
