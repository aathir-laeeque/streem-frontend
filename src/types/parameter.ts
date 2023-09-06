import { Audit, Constraint } from './common';

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
  NOT_STARTED = 'NOT_STARTED',
  EXECUTED = 'EXECUTED',
  BEGIN_EXECUTED = 'BEGIN_EXECUTED',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
  BEING_EXECUTED = 'BEING_EXECUTED',
  PENDING_FOR_APPROVAL = 'PENDING_FOR_APPROVAL',
}

export interface ParameterResponse {
  audit: Audit;
  state: ParameterState;
  hidden: boolean;
  parameterVerifications?: any[];
  reason?: string;
  value?: string | number;
  parameterValueApprovalDto?: Audit | null;
}

export enum TargetEntityType {
  TASK = 'TASK',
  PROCESS = 'PROCESS',
  UNMAPPED = 'UNMAPPED',
}

export enum ParameterMode {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE',
}

export interface BranchingRule {
  id: string;
  key: string;
  constraint: Constraint;
  input: string[];
  thenValue?: any;
  hide?: {
    parameters: string[];
  };
  show?: {
    parameters: string[];
  };
}

// TODO: look into this any type for parameter data
export interface Parameter {
  code: string;
  data: any;
  id: string;
  label: string;
  mandatory: boolean;
  orderTree: number;
  response?: ParameterResponse;
  description?: string;
  type: ParameterType;
  validations: any;
  targetEntityType: TargetEntityType;
  reason?: string;
  autoInitialize?: Record<string, any>;
  autoInitialized?: boolean;
  mode: ParameterMode;
  hidden: boolean;
  processId?: string;
  processName?: string;
  verificationType: string;
  rules?: BranchingRule[];
  hide?: string[];
  show?: string[];
}

export interface StoreParameter extends Parameter {
  isHidden: boolean;
  taskId: string;
  stageId: string;
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
