import { User } from '#store/users/types';
import { Author } from '#views/Checklists/NewPrototype/types';
import { CollaboratorState, Collaborator } from './reviewer.types';

export type Properties = {
  [key: string]: string | null;
};

export type Employee = Pick<
  User,
  'id' | 'employeeId' | 'firstName' | 'lastName'
>;

export type Audit = {
  createdAt: string;
  modifiedAt: string;
  modifiedBy: Employee;
  createdBy: Employee;
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

export enum EnabledStates {
  BEING_BUILT = 'BEING_BUILT', // ENABLE EDITING
  REQUESTED_CHANGES = 'REQUESTED_CHANGES', // ENABLE EDITING
}

export enum DisabledStates {
  SUBMITTED_FOR_REVIEW = 'SUBMITTED_FOR_REVIEW',
  BEING_REVIEWED = 'BEING_REVIEWED',
  READY_FOR_SIGNING = 'READY_FOR_SIGNING',
  SIGN_OFF_INITIATED = 'SIGN_OFF_INITIATED',
  SIGNING_IN_PROGRESS = 'SIGNING_IN_PROGRESS',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  PUBLISHED = 'PUBLISHED',
}

// export enum ChecklistStates {
//   BEING_BUILT = 'BEING_BUILT', // ENABLE EDITING
//   SUBMITTED_FOR_REVIEW = 'SUBMITTED_FOR_REVIEW',
//   BEING_REVIEWED = 'BEING_REVIEWED',
//   REQUESTED_CHANGES = 'REQUESTED_CHANGES', // ENABLE EDITING
//   READY_FOR_SIGNING = 'READY_FOR_SIGNING',
//   SIGN_OFF_INITIATED = 'SIGN_OFF_INITIATED',
//   SIGNING_IN_PROGRESS = 'SIGNING_IN_PROGRESS',
//   READY_FOR_RELEASE = 'READY_FOR_RELEASE',
//   PUBLISHED = 'PUBLISHED',
// }

export const ChecklistStates = {
  ...EnabledStates,
  ...DisabledStates,
};

export enum ChecklistStatesContent {
  BEING_BUILT = 'Being Built',
  SUBMITTED_FOR_REVIEW = 'Being Reviewed',
  BEING_REVIEWED = 'Being Reviewed',
  REQUESTED_CHANGES = 'Being Built',
  READY_FOR_SIGNING = 'Ready for Signing',
  SIGN_OFF_INITIATED = 'Sign Off Initiated',
  SIGNING_IN_PROGRESS = 'Signing in Progress',
  READY_FOR_RELEASE = 'Ready For Realease',
  PUBLISHED = 'Published',
}

export enum ChecklistStatesColors {
  BEING_BUILT = 'blue',
  SUBMITTED_FOR_REVIEW = 'yellow',
  BEING_REVIEWED = 'yellow',
  REQUESTED_CHANGES = 'yellow',
  READY_FOR_SIGNING = 'green',
  SIGN_OFF_INITIATED = 'green',
  SIGNING_IN_PROGRESS = 'green',
  READY_FOR_RELEASE = 'green',
  PUBLISHED = 'green',
}

export type Comment = {
  id: string;
  comments: string;
  commentedAt: number;
  modifiedAt: number;
  commentedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'employeeId'>;
  reviewCycle: number;
  reviewState: CollaboratorState;
};

export type Checklist = {
  id: string;
  name: string;
  code: string;
  status: EnabledStates | DisabledStates;
  versionNumber: number;
  archived?: boolean;
  stages: Stage[];
  properties?: Properties;
  audit: Audit;
  authors: Author[];
  reviewCycle: number;
  comments: Comment[];
  collaborators: Collaborator[];

  noOfJobs?: number;
  noOfTasks?: number;
  version: number | null;
};
