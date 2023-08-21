import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { InputTypes } from '#utils/globalTypes';

// TODO : merge (job composer & prototype composer) types.

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
  MULTI_RESOURCE = 'MULTI_RESOURCE',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  SINGLE_LINE = 'SINGLE_LINE',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

type ChecklistProperty = Pick<Property, 'id' | 'name' | 'value'>;

export enum NonMandatoryParameter {
  INSTRUCTION = 'INSTRUCTION',
  MATERIAL = 'MATERIAL',
}

export type ParameterType = MandatoryParameter | NonMandatoryParameter;

export enum ParameterMode {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE',
}

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
  autoInitialize?: Record<string, any>;
  autoInitialized?: boolean;
  mode: ParameterMode;
  targetEntityType: TargetEntityType;
  verificationType: string;
}

export interface Media {
  id: string;
  name: string;
  link: string;
  type: string;
  filename: string;
  archived: boolean;
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
  PAUSED = 'PAUSED',
  BLOCKED = 'BLOCKED',
}

export enum ParameterExecutionState {
  NOT_STARTED = 'NOT_STARTED',
  EXECUTED = 'EXECUTED',
  BEGIN_EXECUTED = 'BEGIN_EXECUTED',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
  BEING_EXECUTED = 'BEING_EXECUTED',
  PENDING_FOR_APPROVAL = 'PENDING_FOR_APPROVAL',
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
  correctedAt?: number | null;
  correctedBy?: Pick<User, 'id' | 'employeeId' | 'firstName' | 'lastName' | 'archived'>;
  pauseReasons?: Record<string, string>[];
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
  SET_PROPERTY = 'SET_PROPERTY',
  ARCHIVE_OBJECT = 'ARCHIVE_OBJECT',
  SET_RELATION = 'SET_RELATION',
}

export enum AutomationActionActionTypeVisual {
  INCREASE_PROPERTY = 'Increase',
  DECREASE_PROPERTY = 'Decrease',
  CREATE_OBJECT = 'Create Object',
  SET_PROPERTY = 'Set Property',
  ARCHIVE_OBJECT = 'Archive Object',
  SET_RELATION = 'Set Relation',
}

export enum AutomationActionTriggerType {
  TASK_STARTED = 'TASK_STARTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
}

export enum AutomationActionTriggerTypeVisual {
  TASK_COMPLETED = 'task is completed',
  TASK_STARTED = 'task is started',
}

export type AutomationActionDetails = {
  value?: number;
  sortOrder: number;
  parameterId?: string;
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
  choices?: any[];
  entityId?: string;
  entityType?: string;
  dateUnit?: string;
  captureProperty?: string;
};

export type AutomationAction = {
  id: string;
  type: AutomationActionType;
  actionType: AutomationActionActionType;
  actionDetails: AutomationActionDetails;
  triggerType: AutomationActionTriggerType;
  displayName: string;
  orderTree: number;
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
  hidden: boolean;
  parentTaskId?: string;
  showInJob?: boolean;
  data?: {
    parameterId: string;
  };
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
