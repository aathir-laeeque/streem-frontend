import { ComposerActionType } from '#Composer/composer.reducer.types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import {
  fetchJobActivitiesError,
  fetchJobActivitiesOngoing,
  fetchJobActivitiesSuccess,
} from './actions';

export interface JobActivity {
  triggeredOn: string;
  id: number;
  triggeredAt: number;
  event: string;
  action: string;
  severity: string;
  oldData: string | null;
  newData: string | null;
  diffData: string | null;
  details: string;
}

export type JobActivityProps = RouteComponentProps;

export interface JobActivityState {
  readonly logs: JobActivity[];
  readonly pageable: Pageable;
  readonly loading: boolean;
  readonly error?: any;
}

export enum JobActivityAction {
  FETCH_JOB_ACTIVITY = '@@composer/JobActivity/FETCH_JOB_ACTIVITY',
  FETCH_JOB_ACTIVITY_ERROR = '@@composer/JobActivity/FETCH_JOB_ACTIVITY_ERROR',
  FETCH_JOB_ACTIVITY_ONGOING = '@@composer/JobActivity/FETCH_JOB_ACTIVITY_ONGOING',
  FETCH_JOB_ACTIVITY_SUCCESS = '@@composer/JobActivity/FETCH_JOB_ACTIVITY_SUCCESS',
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
      | typeof fetchJobActivitiesError
      | typeof fetchJobActivitiesOngoing
      | typeof fetchJobActivitiesSuccess
    >
  | ComposerActionType;
