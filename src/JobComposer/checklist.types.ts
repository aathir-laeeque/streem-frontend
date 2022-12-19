import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { InputTypes } from '#utils/globalTypes';

export enum MandatoryParameter {
  CHECKLIST = 'CHECKLIST',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  SHOULD_BE = 'SHOULD_BE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  SIGNATURE = 'SIGNATURE',
  MULTI_LINE = 'MULTI_LINE',
  YES_NO = 'YES_NO',
  NUMBER = 'NUMBER',
  CALCULATION = 'CALCULATION',
  RESOURCE = 'RESOURCE',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  SINGLE_LINE = 'SINGLE_LINE',
}

type ChecklistProperty = Pick<Property, 'id' | 'name' | 'value'>;

export enum NonMandatoryParameter {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ParameterType = MandatoryParameter | NonMandatoryParameter;

export interface Parameter {
  id: string;
  type: ParameterType;
  // TODO: look into type for data in parameter
  data: any;
  mandatory: boolean;
  orderTree: number;
  hasError: boolean;
  label?: string;
  response?: any;
  hide?: string[];
  show?: string[];
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

export type AuditUserType = Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName'>;

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

export enum AutomationActionType {
  PROCESS_BASED = 'PROCESS_BASED',
  OBJECT_BASED = 'OBJECT_BASED',
}

export enum AutomationTargetEntityType {
  OBJECT = 'OBJECT',
  RESOURCE_PARAMETER = 'RESOURCE_PARAMETER',
}

export enum AutomationActionActionType {
  INCREASE_PROPERTY = 'INCREASE_PROPERTY',
  DECREASE_PROPERTY = 'DECREASE_PROPERTY',
  CREATE_OBJECT = 'CREATE_OBJECT',
}

export enum AutomationActionActionTypeVisual {
  INCREASE_PROPERTY = 'Increase',
  DECREASE_PROPERTY = 'Decrease',
  CREATE_OBJECT = 'Create Object',
}

export enum AutomationActionTriggerType {
  TASK_COMPLETED = 'TASK_COMPLETED',
}

export enum AutomationActionTriggerTypeVisual {
  TASK_COMPLETED = 'task is completed',
}

export type AutomationActionDetails = {
  value: number;
  sortOrder: number;
  parameterId: string;
  propertyId: string;
  propertyInputType: InputTypes;
  propertyExternalId: string;
  propertyDisplayName: string;
  relationId: number;
  urlPath: string;
  collection: string;
  objectTypeId: string;
  objectTypeExternalId: string;
  objectTypeDisplayName: string;
  referencedParameterId: string;
};

export type AutomationAction = {
  id: string;
  type: AutomationActionType;
  actionType: AutomationActionActionType;
  actionDetails: AutomationActionDetails;
  triggerType: AutomationActionTriggerType;
};

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
