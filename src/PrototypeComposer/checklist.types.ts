import { AutomationAction, ParameterMode } from '#JobComposer/checklist.types';
import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { CollaboratorState, Collaborator } from './reviewer.types';

// TODO : merge (job composer & prototype composer) types.

export type ChecklistProperty = Pick<Property, 'id' | 'name' | 'value' | 'label'>;

export type Employee = Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName' | 'archived'>;

export type Audit = {
  createdAt: string;
  modifiedAt: string;
  modifiedBy: Employee;
  createdBy: Employee;
};

export enum MandatoryParameter {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  SHOULD_BE = 'SHOULD_BE',
  SIGNATURE = 'SIGNATURE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_LINE = 'MULTI_LINE',
  YES_NO = 'YES_NO',
  NUMBER = 'NUMBER',
  CALCULATION = 'CALCULATION',
  RESOURCE = 'RESOURCE',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  SINGLE_LINE = 'SINGLE_LINE',
  MULTI_RESOURCE = 'MULTI_RESOURCE',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export enum NonMandatoryParameter {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ParameterType = MandatoryParameter | NonMandatoryParameter;

export enum ParameterState {
  EXECUTED = 'EXECUTED',
}

export type ParameterResponse = {
  audit: Audit;
  state: ParameterState;
};

export enum TargetEntityType {
  TASK = 'TASK',
  PROCESS = 'PROCESS',
  UNMAPPED = 'UNMAPPED',
}

export type Parameter = {
  code: string;
  // TODO: look into this any type for parameter data
  data: any;
  id: string;
  label: string;
  mandatory: boolean;
  orderTree: number;
  response?: ParameterResponse | null;
  description: string | null;
  type: ParameterType;
  validations: any;
  targetEntityType: TargetEntityType;
  reason?: string;
  autoInitialize?: Record<string, any>;
  autoInitialized?: boolean;
  mode: ParameterMode;
  hidden: boolean;
};

export type Media = {
  id: string;
  name: string;
  link: string;
  type: string;
  filename: string;
  description: string;
};

export enum TaskExecutionState {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  IN_PROGRESS = 'IN_PROGRESS',
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
  state: TaskExecutionState;
  assignees: Pick<
    User,
    'id' | 'employeeId' | 'firstName' | 'lastName' | 'email' | 'username' | 'archived'
  >[];
};

export enum TimerOperator {
  LESS_THAN = 'LESS_THAN',
  NOT_LESS_THAN = 'NOT_LESS_THAN',
}

export type Task = {
  parameters: Parameter[];
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
  automations: AutomationAction[];
};

export type Stage = {
  code: string;
  id: string;
  name: string;
  orderTree: number;
  tasks: Task[];
};

export enum EnabledStates {
  BEING_BUILT = 'BEING_BUILT',
  BEING_REVISED = 'BEING_REVISED',
  REQUESTED_CHANGES = 'REQUESTED_CHANGES',
}

export enum DisabledStates {
  SUBMITTED_FOR_REVIEW = 'SUBMITTED_FOR_REVIEW',
  BEING_REVIEWED = 'BEING_REVIEWED',
  READY_FOR_SIGNING = 'READY_FOR_SIGNING',
  SIGN_OFF_INITIATED = 'SIGN_OFF_INITIATED',
  SIGNING_IN_PROGRESS = 'SIGNING_IN_PROGRESS',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
}

export type AllChecklistStates = EnabledStates | DisabledStates;

export const ChecklistStates = {
  ...EnabledStates,
  ...DisabledStates,
};

export enum ChecklistStatesContent {
  BEING_BUILT = 'Being Built',
  SUBMITTED_FOR_REVIEW = 'Submitted For Review',
  BEING_REVIEWED = 'Being Reviewed',
  BEING_REVISED = 'Being Revised',
  REQUESTED_CHANGES = 'Requested Changes',
  READY_FOR_SIGNING = 'Ready for Signing',
  SIGN_OFF_INITIATED = 'Under Signing',
  SIGNING_IN_PROGRESS = 'Signing in progress',
  READY_FOR_RELEASE = 'Ready For Release',
  PUBLISHED = 'Published',
  DEPRECATED = 'Deprecated',
}

export enum ChecklistStatesColors {
  BEING_BUILT = '#1d84ff',
  SUBMITTED_FOR_REVIEW = '#f7b500',
  BEING_REVIEWED = '#f7b500',
  BEING_REVISED = '#f7b500',
  REQUESTED_CHANGES = '#f7b500',
  READY_FOR_SIGNING = '#5aa700',
  SIGN_OFF_INITIATED = '#5aa700',
  SIGNING_IN_PROGRESS = '#5aa700',
  READY_FOR_RELEASE = '#5aa700',
  PUBLISHED = '#5aa700',
  DEPRECATED = '#FF6B6B',
}

export type Comment = {
  id: string;
  comments: string;
  commentedAt: number;
  modifiedAt: number;
  commentedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'employeeId'>;
  phase: number;
  state: CollaboratorState;
};

export type JobLogColumnType = {
  id: string;
  type: LogType;
  displayName: string;
  triggerType: string;
  orderTree: number;
};

export type Checklist = {
  description: string;
  id: string;
  name: string;
  code: string;
  state: EnabledStates | DisabledStates;
  versionNumber: number;
  archived?: boolean;
  stages: Stage[];
  properties?: ChecklistProperty[];
  audit: Audit;
  phase?: number;
  comments: Comment[];
  collaborators: Collaborator[];
  jobLogColumns: JobLogColumnType[];
  noOfJobs?: number;
  noOfTasks?: number;
  version: number | null;
  global: boolean;
  parameters: any[];
};

export enum LogType {
  DATE = 'DATE',
  FILE = 'FILE',
  TEXT = 'TEXT',
}
