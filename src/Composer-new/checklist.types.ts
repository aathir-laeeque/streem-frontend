import { User } from '#store/users/types';
import { Reviewer, ReviewerState } from './reviewer.types';

export type Properties = {
  [key: string]: string | null;
};

export type Employee = {
  employeeId: string;
  firstName: string;
  lastName: string;
};

export type Audit = {
  modifiedAt: string;
  modifiedBy: Employee;
};

export enum MandatoryActivity {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  SHOULD_BE = 'SHOULD_BE',
  PARAMETER = 'PARAMETER',
  SIGNATURE = 'SIGNATURE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  TEXTBOX = 'TEXTBOX',
  YES_NO = 'YES_NO',
}

export enum NonMandatoryActivity {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ActivityType = MandatoryActivity | NonMandatoryActivity;

export enum ActivityStatus {
  EXECUTED = 'EXECUTED',
}

export type ActivityResponse = {
  audit: Audit;
  status: ActivityStatus;
};

export type Activity = {
  code: string;
  // TODO: look into this any type for activity data
  data: any;
  id: string;
  label: string;
  mandatory: boolean;
  orderTree: number;
  response?: ActivityResponse | null;
  type: ActivityType;
};

export type Media = {
  id: string;
  name: string;
  link: string;
  type: string;
  filename: string;
};

export enum TaskExecutionStatus {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_ERROR_CORRECTION = 'COMPLETED_WITH_ERROR_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_ERROR_CORRECTION = 'ENABLED_FOR_ERROR_CORRECTION',
  INPROGRESS = 'INPROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SKIPPED = 'SKIPPED',
}

export type TaskExecution = {
  audit: Audit;
  correctionReason: string;
  id: string;
  period: number;
  reason: string;
  startedBy: Employee;
  startedAt: string;
  status: TaskExecutionStatus;
  assignees: Pick<
    User,
    | 'id'
    | 'employeeId'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'username'
    | 'archived'
    | 'verified'
  >[];
};

export enum TimerOperator {
  LESS_THAN = 'LESS_THAN',
  NOT_LESS_THAN = 'NOT_LESS_THAN',
}

export type Task = {
  activities: Activity[];
  code: string;
  hasStop: boolean;
  id: string;
  mandatory: boolean;
  maxPeriod?: number;
  medias: Media[];
  minPeriod?: number;
  name: string;
  orderTree: number;
  taskExecution: TaskExecution;
  timed: boolean;
  timerOperator?: TimerOperator;
};

export type Stage = {
  code: string;
  id: string;
  name: string;
  orderTree: number;
  tasks: Task[];
};

export enum ChecklistStates {
  DRAFT = 'DRAFT',
  BEING_REVIEWED = 'BEING_REVIEWED',
  CR_IN_PROGRESS = 'CR_IN_PROGRESS',
  READY_FOR_SIGNING = 'READY_FOR_SIGNING',
  SIGN_OFF_INITIATED = 'SIGN_OFF_INITIATED',
  SIGNING_IN_PROGRESS = 'SIGNING_IN_PROGRESS',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  PUBLISHED = 'PUBLISHED',
}

export enum ChecklistStatesContent {
  DRAFT = 'Being Built',
  BEING_REVIEWED = 'Being Reviewed',
  CR_IN_PROGRESS = 'Being Built',
  READY_FOR_SIGNING = 'READY_FOR_SIGNING',
  SIGN_OFF_INITIATED = 'SIGN_OFF_INITIATED',
  SIGNING_IN_PROGRESS = 'SIGNING_IN_PROGRESS',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  PUBLISHED = 'PUBLISHED',
}

export type Comment = {
  id: string;
  comments: string;
  commentedAt: number;
  commentedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'employeeId'>;
  reviewCycle: number;
  reviewState: ReviewerState;
};

export type Checklist = {
  archived?: boolean;
  audit: Audit;
  code: string;
  id: string;
  name: string;
  noOfJobs?: number;
  noOfTasks?: number;
  properties?: Properties;
  stages: Stage[];
  status: ChecklistStates;
  version: number | null;
  reviewers: Reviewer[];
  authors: Reviewer[];
  comments: Comment[];
  reviewCycle: number;
};
