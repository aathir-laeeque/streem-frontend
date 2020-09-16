interface Properties {
  [key: string]: string | null;
}

export enum MandatoryActivity {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
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

export interface Audit {
  modifiedAt: string;
  modifiedBy: {
    employeeId: string;
    firstName: string;
    lastName: string;
  };
}

export interface TaskExecution {
  audit: Audit;
  correctionReason?: string | null;
  endedAt?: string;
  id: number;
  period?: number | null;
  reason?: string | null;
  startedAt?: string | null;
  startedBy?: string | null;
  status: TaskExecutionStatus;
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
  period?: number;
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
  id: number;
  name: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  properties?: Properties;
  noOfTasks?: number;
}
