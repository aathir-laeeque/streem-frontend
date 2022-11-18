import { ComposerActionType } from '#JobComposer/composer.reducer.types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import {
  fetchJobAuditLogsError,
  fetchJobAuditLogsOngoing,
  fetchJobAuditLogsSuccess,
} from './actions';

export type JobAuditLogType = {
  id: string;
  jobId: string;
  action: string;
  details: string;
  triggeredAt: number;
  triggeredBy: number;
};

export interface JobAuditLogState {
  readonly logs: JobAuditLogType[];
  readonly pageable: Pageable;
  readonly loading: boolean;
  readonly error?: any;
}

export enum JobParameterAction {
  FETCH_JOB_PARAMETER = '@@jobComposer/JobParameter/FETCH_JOB_PARAMETER',
  FETCH_JOB_PARAMETER_ERROR = '@@jobComposer/JobParameter/FETCH_JOB_PARAMETER_ERROR',
  FETCH_JOB_PARAMETER_ONGOING = '@@jobComposer/JobParameter/FETCH_JOB_PARAMETER_ONGOING',
  FETCH_JOB_PARAMETER_SUCCESS = '@@jobComposer/JobParameter/FETCH_JOB_PARAMETER_SUCCESS',
}

export type JobParameterActionType =
  | ReturnType<
      | typeof fetchJobAuditLogsError
      | typeof fetchJobAuditLogsOngoing
      | typeof fetchJobAuditLogsSuccess
    >
  | ComposerActionType;
