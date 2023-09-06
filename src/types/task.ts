import { AutomationAction, Media, TimerOperator } from '#JobComposer/checklist.types';
import { Parameter } from '#PrototypeComposer/checklist.types';
import { User } from '#store/users/types';
import { Audit, ObjectKeys, PartialUser } from './common';

export const NOT_STARTED_TASK_STATES = {
  NOT_STARTED: {},
} as const;

export const IN_PROGRESS_TASK_STATES = {
  IN_PROGRESS: {},
  BLOCKED: {},
  PAUSED: {},
} as const;

export const COMPLETED_TASK_STATES = {
  COMPLETED: {},
  COMPLETED_WITH_EXCEPTION: {},
  SKIPPED: {},
} as const;

export const TASK_EXECUTION_STATES = {
  ...NOT_STARTED_TASK_STATES,
  ...IN_PROGRESS_TASK_STATES,
  ...COMPLETED_TASK_STATES,
} as const;

export type NotStartedTaskStates = ObjectKeys<typeof NOT_STARTED_TASK_STATES>;
export type InProgressTaskStates = ObjectKeys<typeof IN_PROGRESS_TASK_STATES>;
export type CompletedTaskStates = ObjectKeys<typeof COMPLETED_TASK_STATES>;
export type TaskExecutionStates = ObjectKeys<typeof TASK_EXECUTION_STATES>;

export const TASK_TYPE = {
  DYNAMIC: {},
  STATIC: {},
} as const;

export type TaskType = ObjectKeys<typeof TASK_TYPE>;

export enum TaskPauseReasons {
  BIO_BREAK = 'Bio break',
  SHIFT_BREAK = 'Shift break',
  EQUIPMENT_BREAKDOWN = 'Equipment Breakdown',
  LUNCH_BREAK = 'Lunch break',
  AREA_BREAKDOWN = 'Area Breakdown',
  EMERGENCY_DRILL = 'Emergency Drill',
  FIRE_ALARM = 'Fire alarm',
  OTHER = 'Other',
}

export interface TaskExecution {
  id: string;
  period: any;
  correctionReason: string;
  correctionEnabled: boolean;
  reason: string;
  assignees: User[];
  startedBy: Record<string, string>;
  startedAt: number;
  endedAt: number;
  endedBy: Record<string, string>;
  state: TaskExecutionStates;
  audit: Audit;
  hide: string[];
  show: string[];
  correctedBy: PartialUser;
  correctedAt: number;
  duration: number;
  pauseReasons: Record<string, string>[];
}

export interface Task {
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
  timerOperator: TimerOperator;
  automations: AutomationAction[];
  hidden: boolean;
  parentTaskId?: string;
  showInJob?: boolean;
  type?: TaskType;
  data?: {
    parameterId: string;
  };
}

export interface StoreTask extends Omit<Task, 'parameters'> {
  isUserAssignedToTask?: boolean;
  stageId?: string;
  visibleParametersCount: number;
  previous?: string;
  next?: string;
  canSkipTask: boolean;
  parameters: string[];
  errors: string[];
  parametersErrors: Map<string, string[]>;
}
