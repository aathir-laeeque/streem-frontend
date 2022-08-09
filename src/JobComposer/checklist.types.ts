import { Property } from '#store/properties/types';
import { User } from '#store/users/types';

export enum MandatoryActivity {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  PARAMETER = 'PARAMETER',
  SHOULD_BE = 'SHOULD_BE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  SIGNATURE = 'SIGNATURE',
  TEXTBOX = 'TEXTBOX',
  YES_NO = 'YES_NO',
  NUMBER = 'NUMBER',
}

type ChecklistProperty = Pick<Property, 'id' | 'name' | 'value'>;

export enum NonMandatoryActivity {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ActivityType = MandatoryActivity | NonMandatoryActivity;

export interface Activity {
  id: string;
  type: ActivityType;
  // TODO: look into type for data in activity
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
  response?: any;
}

export interface Media {
  id: string;
  name: string;
  link: string;
  type: string;
  filename: string;
}

export enum StartedTaskStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  IN_PROGRESS = 'IN_PROGRESS',
  SKIPPED = 'SKIPPED',
}

export enum CompletedTaskStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  SKIPPED = 'SKIPPED',
}

export enum TaskExecutionState {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SKIPPED = 'SKIPPED',
}

export type AuditUserType = Pick<
  User,
  'id' | 'employeeId' | 'firstName' | 'lastName'
>;

export interface Audit {
  modifiedAt: number;
  modifiedBy: AuditUserType;
}

export interface TaskExecution {
  audit: Audit;
  endedAt?: number;
  id: string;
  period?: number | null;
  reason?: string | null;
  startedAt?: number | null;
  startedBy?: AuditUserType;
  state: TaskExecutionState;
  assignees: User[];
  correctionEnabled: boolean;
  correctionReason?: string | null;
}

export enum TimerOperator {
  LESS_THAN = 'LESS_THAN',
  NOT_LESS_THAN = 'NOT_LESS_THAN',
}

export interface Task {
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
  timerOperator: TimerOperator;
}

export interface Stage {
  id: string;
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
  properties?: ChecklistProperty[];
  noOfTasks?: number;
}
