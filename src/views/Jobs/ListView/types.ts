import { ParameterVerificationStatus } from '#JobComposer/ActivityList/types';
import { Checklist, ParameterExecutionState } from '#JobComposer/checklist.types';
import {
  // Checklist,
  Parameter,
  ParameterVerificationTypeEnum,
} from '#PrototypeComposer/checklist.types';
import { User } from '#store/users/types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import {
  createJob,
  createJobError,
  createJobSuccess,
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
  updateJob,
  updateJobSuccess,
} from './actions';

export type Assignee = Pick<User, 'employeeId' | 'firstName' | 'id' | 'lastName'> & {
  jobId: string;
};

export type JobRelationTarget = {
  id: string;
  externalId: string;
  displayName: string;
  collection: string;
};

// TODO properties as null seems unnecessary here consider removing it
export type Job = {
  checklist: Checklist;
  code: string;
  completedTasks: number;
  id: string;
  state: JobStateType;
  totalTasks: number;
  name?: string;
  assignees: Assignee[];
  expectedStartDate?: number;
  expectedEndDate?: number;
  startedAt?: number;
  endedAt?: number;
  jobScheduler?: Record<string, any>;
  jobSchedulerId?: number;
  parameterValues: Parameter[];
};

export type Verification = {
  parameterName: string;
  taskName: string;
  taskId: string;
  processName: string;
  code: string;
  createdBy: Record<string, any>;
  requestedTo: Record<string, any>;
  modifiedBy: Pick<User, 'firstName' | 'lastName' | 'employeeId'>;
  modifiedAt: number;
  stageId: string;
  requestedAt: string;
  verificationStatus: ParameterVerificationStatus;
  verificationType: ParameterVerificationTypeEnum;
  comments: string;
  evaluationState: ParameterExecutionState;
};

export type ListViewProps = RouteComponentProps<{
  id: Checklist['id'];
  location: { state: { processFilter?: Record<string, string> } };
}>;

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
  readonly submitting: boolean;
  readonly createdData: any;
  readonly reRender: boolean;
}

export enum ListViewAction {
  FETCH_JOBS = '@@job/New-ListView/FETCH_JOBS',
  FETCH_JOBS_ERROR = '@@job/New-ListView/FETCH_JOBS_ERROR',
  FETCH_JOBS_ONGOING = '@@job/New-ListView/FETCH_JOBS_ONGOING',
  FETCH_JOBS_SUCCESS = '@@job/New-ListView/FETCH_JOBS_SUCCESS',
  CREATE_JOB = '@@job/ListView/CREATE_JOB',
  CREATE_JOB_SUCCESS = '@@job/ListView/CREATE_JOB_SUCCESS',
  CREATE_OR_UPDATE_JOB_ERROR = '@@job/ListView/CREATE_OR_UPDATE_JOB_ERROR',
  UPDATE_JOB = '@@job/ListView/UPDATE_JOB',
  UPDATE_JOB_SUCCESS = '@@job/ListView/UPDATE_JOB_SUCCESS',
}

export type ListViewActionType = ReturnType<
  | typeof fetchJobs
  | typeof fetchJobsError
  | typeof fetchJobsOngoing
  | typeof fetchJobsSuccess
  | typeof createJobSuccess
  | typeof createJob
  | typeof createJobError
  | typeof updateJob
  | typeof updateJobSuccess
>;

export type fetchJobsType = {
  facilityId?: string;
  page: number;
  size: number;
  filters: Record<string, any>;
  sort: string;
};

export type fetchJobsSuccessType = {
  data: Job[];
  pageable: Pageable;
};
