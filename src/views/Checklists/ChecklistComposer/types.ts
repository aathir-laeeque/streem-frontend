import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchCHecklistSuccess,
} from './actions';

export interface ChecklistComposerProps extends RouteComponentProps {
  checklistId?: number;
}

export interface ChecklistComposerState {
  readonly checklist: Checklist | undefined;
  readonly loading: boolean;
  readonly error: any;
}

export enum ChecklistComposerAction {
  FETCH_CHECKLIST = '@@checklist/Composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@checklist/Composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@checklist/Composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@checklist/Composer/FETCH_CHECKLIST_SUCCESS',
}

export type ChecklistComposerActionType = ReturnType<
  | typeof fetchChecklist
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistError
  | typeof fetchCHecklistSuccess
>;