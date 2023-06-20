import { Job } from '#views/Jobs/ListView/types';
import { Parameter, Stage, Task } from '../checklist.types';

export type ParameterListProps = {
  parameters: Parameter[];
  isTaskStarted: boolean;
  isTaskCompleted: boolean;
  isCorrectingError: boolean;
  isLoggedInUserAssigned: boolean;
  isJobInInbox: boolean;
};

export type ParameterProps = {
  parameter: Parameter;
  isCorrectingError: boolean;
  isTaskCompleted?: boolean;
  isLoggedInUserAssigned?: boolean;
};

export enum Selections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export type ParametersById = Record<
  Parameter['id'],
  Parameter & { hasError: boolean; errorMessage?: string }
>;

export type ParametersOrderInTaskInStage = Record<
  Stage['id'],
  Record<Task['id'], Parameter['id'][]>
>;

export enum ParameterErrors {
  E401 = 'PARAMETER_INCOMPLETE',
  E9002 = 'PARAMETER_VERIFICATION_INCOMPLETE',
}

export enum SupervisorResponse {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export type approveRejectParameterType = {
  jobId: Job['id'];
  parameterId: Parameter['id'];
  type: SupervisorResponse;
};

export enum ParameterVerificationStatus {
  PENDING = 'PENDING',
  RECALLED = 'RECALLED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
