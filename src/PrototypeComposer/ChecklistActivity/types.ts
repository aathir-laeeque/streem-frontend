import { ComposerActionType } from '#PrototypeComposer/reducer.types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import {
  fetchChecklistActivitiesError,
  fetchChecklistActivitiesOngoing,
  fetchChecklistActivitiesSuccess,
} from './actions';

export interface ChecklistActivity {
  triggeredOn: string;
  id: string;
  triggeredAt: number;
  event: string;
  action: string;
  severity: string;
  oldData: string | null;
  newData: string | null;
  diffData: string | null;
  details: string;
}

export interface ChecklistActivityState {
  readonly logs: ChecklistActivity[];
  readonly pageable: Pageable;
  readonly loading: boolean;
  readonly error?: any;
}

export enum ChecklistActivityAction {
  FETCH_CHECKLIST_ACTIVITY = '@@checklistComposer/checklistActivity/FETCH_CHECKLIST_ACTIVITY',
  FETCH_CHECKLIST_ACTIVITY_ERROR = '@@checklistComposer/checklistActivity/FETCH_CHECKLIST_ACTIVITY_ERROR',
  FETCH_CHECKLIST_ACTIVITY_ONGOING = '@@checklistComposer/checklistActivity/FETCH_CHECKLIST_ACTIVITY_ONGOING',
  FETCH_CHECKLIST_ACTIVITY_SUCCESS = '@@checklistComposer/checklistActivity/FETCH_CHECKLIST_ACTIVITY_SUCCESS',
}

export enum ChecklistActivitySeverity {
  CRITICAL = 'CRITICAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFORMATION = 'INFORMATION',
  UNKNOWN = 'UNKNOWN',
}

export type ChecklistActivityActionType =
  | ReturnType<
      | typeof fetchChecklistActivitiesError
      | typeof fetchChecklistActivitiesOngoing
      | typeof fetchChecklistActivitiesSuccess
    >
  | ComposerActionType;

export type ChecklistActivityProps = RouteComponentProps;
