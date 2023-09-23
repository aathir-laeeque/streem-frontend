import { Checklist, Parameter } from '#PrototypeComposer/checklist.types';
import { Users } from '#store/users/types';
import { FileUploadData } from '#utils/globalTypes';
import { ObjectKeys, PartialUser } from './common';
import { StoreParameter } from './parameter';
import { StoreStage } from './stage';
import { StoreTask } from './task';

export const UNASSIGNED_JOB_STATES = {
  UNASSIGNED: {
    title: 'Not Started',
    color: '#f7b500',
  },
} as const;

export const ASSIGNED_JOB_STATES = {
  ASSIGNED: {
    title: 'Not Started',
    color: '#f7b500',
  },
  BLOCKED: {
    title: 'Approval Pending',
    color: '#f7b500',
  },
  IN_PROGRESS: {
    title: 'Started',
    color: '#1d84ff',
  },
} as const;

export const COMPLETED_JOB_STATES = {
  COMPLETED: {
    title: 'Completed',
    color: '#5aa700',
  },
  COMPLETED_WITH_EXCEPTION: {
    title: 'Completed with Exception',
    color: '#f7b500',
  },
} as const;

export const JOB_STATES = {
  ...UNASSIGNED_JOB_STATES,
  ...ASSIGNED_JOB_STATES,
  ...COMPLETED_JOB_STATES,
} as const;

export type UnassignedJobStates = ObjectKeys<typeof ASSIGNED_JOB_STATES>;
export type AssignedJobStates = ObjectKeys<typeof ASSIGNED_JOB_STATES>;
export type CompletedJobStates = ObjectKeys<typeof COMPLETED_JOB_STATES>;
export type JobStates = ObjectKeys<typeof JOB_STATES>;

export type ExceptionValues = {
  comment: string;
  medias: FileUploadData[];
  reason: string;
};

export interface Job {
  checklist: Checklist;
  code: string;
  completedTasks: number;
  id: string;
  state: JobStates;
  totalTasks: number;
  name?: string;
  assignees: PartialUser &
    {
      jobId: string;
    }[];
  expectedStartDate?: number;
  expectedEndDate?: number;
  startedAt?: number;
  endedAt?: number;
  jobScheduler?: Record<string, any>;
  jobSchedulerId?: number;
  parameterValues: Parameter[];
}

export const REFETCH_JOB_ERROR_CODES = {
  E223: 'TASK_CORRECTION_ALREADY_ENABLED',
  E707: 'JOB_ALREADY_STARTED',
  E701: 'JOB_NOT_FOUND',
  E702: 'JOB_IS_NOT_IN_PROGRESS',
  E703: 'JOB_ALREADY_COMPLETED',
  E403: 'TASK_ALREADY_COMPLETED',
  E212: 'TASK_NOT_IN_PROGRESS',
  E213: 'TASK_ALREADY_COMPLETED',
  E214: 'TASK_NOT_ENABLED_FOR_CORRECTION',
  E224: 'TASK_ALREADY_IN_PROGRESS',
  E450: 'PARAMETER_DATA_INCONSISTENT',
} as const;

export interface JobStore {
  id?: string;
  stages: Map<string, StoreStage>;
  tasks: Map<string, StoreTask>;
  parameters: Map<string, StoreParameter>;
  cjfValues: string[];
  loading: boolean;
  state?: JobStates;
  totalTasks?: number;
  expectedEndDate?: number;
  expectedStartDate?: number;
  completedTasks?: number;
  code?: string;
  jobFromBE?: Job;
  processId?: string;
  processName?: string;
  processCode?: string;
  isInboxView: boolean;
  taskNavState: {
    previous?: string;
    current?: string;
    next?: string;
    stopExecution: boolean;
  };
  pendingTasks: Set<string>;
  showVerificationBanner: boolean;
  taskIdsWithStop: string[];
  taskIdsWithStopActiveIndex: number;
  updating?: boolean;
  assignments: {
    loading: boolean;
    isUserAssigned: boolean;
    assignees: Users;
  };
  stageReports?: {
    completedTasks: number;
    stageId: string;
    stageName: string;
    tasksInProgress: boolean;
    totalTasks: number;
  };
}
