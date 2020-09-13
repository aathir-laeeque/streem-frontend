interface Properties {
  [key: string]: string | null;
}

export enum ActivityType {
  MATERIAL = 'MATERIAL',
  INSTRUCTION = 'INSTRUCTION',
  YES_NO = 'YES_NO',
  CHECKLIST = 'CHECKLIST',
  SHOULD_BE = 'SHOULD_BE',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  TEXTBOX = 'TEXTBOX',
  SIGNATURE = 'SIGNATURE',
}

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
  COMPLETED_WITH_ERROR_CORRECTION = 'COMPLETED_WITH_ERROR_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_ERROR_CORRECTION = 'ENABLED_FOR_ERROR_CORRECTION',
  INPROGRESS = 'INPROGRESS',
  SKIPPED = 'SKIPPED',
}

export enum CompletedTaskStates {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_ERROR_CORRECTION = 'COMPLETED_WITH_ERROR_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_ERROR_CORRECTION = 'ENABLED_FOR_ERROR_CORRECTION',
  SKIPPED = 'SKIPPED',
}

export enum TaskExecutionStatus {
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_ERROR_CORRECTION = 'COMPLETED_WITH_ERROR_CORRECTION',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  ENABLED_FOR_ERROR_CORRECTION = 'ENABLED_FOR_ERROR_CORRECTION',
  INPROGRESS = 'INPROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SKIPPED = 'SKIPPED',
}

export interface TaskAudit {
  modifiedAt: string;
  modifiedBy: {
    employeeId: string;
    firstName: string;
    lastName: string;
  };
}

export interface TaskExecution {
  audit: TaskAudit;
  correctionReason?: string | null;
  id: number;
  period?: number | null;
  reason?: string | null;
  startedAt?: string | null;
  startedBy?: string | null;
  status: TaskExecutionStatus;
}

export interface Task {
  activities: Activity[];
  code: string;
  hasStop: boolean;
  id: number;
  medias: Media[];
  name: string;
  orderTree: number;
  period?: number;
  taskExecution: TaskExecution;
  timed: boolean;
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
  id: number;
  name: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  properties?: Properties;
  noOfTasks?: number;
}
