import { User } from '#store/users/types';

interface Properties {
  [key: string]: string | null;
}

export enum MandatoryActivity {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  PARAMETER = 'PARAMETER',
  SHOULD_BE = 'SHOULD_BE',
  SIGNATURE = 'SIGNATURE',
  TEXTBOX = 'TEXTBOX',
  YES_NO = 'YES_NO',
}

export enum NonMandatoryActivity {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ActivityType = MandatoryActivity | NonMandatoryActivity;

export interface Activity {
  id: number;
  type: ActivityType;
  // TODO: look into type for data in activity
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
  response?: any;
}

export interface Media {
  id: number;
  name: string;
  link: string;
  type: string;
  filename: string;
}

export enum StartedTaskStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_CORRECTION = 'COMPLETED_WITH_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_CORRECTION = 'ENABLED_FOR_CORRECTION',
  IN_PROGRESS = 'IN_PROGRESS',
  SKIPPED = 'SKIPPED',
}

export enum CompletedTaskStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_CORRECTION = 'COMPLETED_WITH_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_CORRECTION = 'ENABLED_FOR_CORRECTION',
  SKIPPED = 'SKIPPED',
}

export enum TaskExecutionState {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_CORRECTION = 'COMPLETED_WITH_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_CORRECTION = 'ENABLED_FOR_CORRECTION',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SKIPPED = 'SKIPPED',
}

export interface Audit {
  modifiedAt: number;
  modifiedBy: {
    employeeId: string;
    firstName: string;
    lastName: string;
  };
}

export interface TaskExecution {
  audit: Audit;
  correctionReason?: string | null;
  endedAt?: number;
  id: number;
  period?: number | null;
  reason?: string | null;
  startedAt?: number | null;
  startedBy?: string | null;
  state: TaskExecutionState;
  assignees: User[];
}

export enum TimerOperator {
  LESS_THAN = 'LESS_THAN',
  NOT_LESS_THAN = 'NOT_LESS_THAN',
}

export interface Task {
  activities: Activity[];
  code: string;
  hasStop: boolean;
  id: number;
  mandatory: boolean;
  maxPeriod?: number;
  medias: Media[];
  minPeriod?: number;
  name: string;
  orderTree: number;
  taskExecution: TaskExecution;
  timed: boolean;
  timerOperator: TimerOperator;
}

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  tasks: Task[];
}

export interface Checklist {
  archived?: boolean;
  code: string;
  id: string;
  name: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  properties?: Properties;
  noOfTasks?: number;
}
