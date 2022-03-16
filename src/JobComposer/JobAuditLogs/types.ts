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

export type JobActivityProps = RouteComponentProps;

export interface JobAuditLogState {
  readonly logs: JobAuditLogType[];
  readonly pageable: Pageable;
  readonly loading: boolean;
  readonly error?: any;
}

export enum JobActivityAction {
  FETCH_JOB_ACTIVITY = '@@jobComposer/JobActivity/FETCH_JOB_ACTIVITY',
  FETCH_JOB_ACTIVITY_ERROR = '@@jobComposer/JobActivity/FETCH_JOB_ACTIVITY_ERROR',
  FETCH_JOB_ACTIVITY_ONGOING = '@@jobComposer/JobActivity/FETCH_JOB_ACTIVITY_ONGOING',
  FETCH_JOB_ACTIVITY_SUCCESS = '@@jobComposer/JobActivity/FETCH_JOB_ACTIVITY_SUCCESS',
}

export enum JobActivitySeverity {
  CRITICAL = 'CRITICAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFORMATION = 'INFORMATION',
  UNKNOWN = 'UNKNOWN',
}

export type JobActivityActionType =
  | ReturnType<
      | typeof fetchJobAuditLogsError
      | typeof fetchJobAuditLogsOngoing
      | typeof fetchJobAuditLogsSuccess
    >
  | ComposerActionType;
