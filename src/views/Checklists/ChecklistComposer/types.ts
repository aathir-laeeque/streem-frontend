import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import { Stage } from './StageListView/types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
} from './actions';

export interface ChecklistComposerProps extends RouteComponentProps {
  checklistId?: string;
}

export interface ChecklistComposerState {
  readonly activeChecklist?: Checklist;
  readonly activeStageIndex?: number;
  readonly loading: boolean;
  readonly error: any;
  readonly stages?: Stage[] | [];
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
  | typeof fetchChecklistSuccess
>;
