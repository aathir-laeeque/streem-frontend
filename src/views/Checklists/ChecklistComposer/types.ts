import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
} from './actions';
import { Stage } from './StageList/types';
import { Step } from './StepsList/StepView/types';

export interface ChecklistComposerProps extends RouteComponentProps {
  checklistId?: string;
}

export interface ChecklistComposerState {
  readonly activeChecklist?: Checklist;
  readonly activeStageIndex?: number;
  readonly activeStepIndex?: number;
  readonly error: any;
  readonly loading: boolean;
  readonly stages?: Partial<Stage>[];
  readonly steps?: Step[];
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
