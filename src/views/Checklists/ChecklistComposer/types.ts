import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  setChecklistModes,
} from './actions';
import { Stage } from './StageList/types';
import { Step } from './StepsList/StepView/types';

export enum ChecklistState {
  ADD_EDIT = 'add-edit',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
}

export enum TemplateMode {
  EDITABLE = 'editable',
  NON_EDITABLE = 'non-editable',
}

export interface ChecklistComposerProps extends RouteComponentProps {
  jobid?: string;
  checklistId?: string;
  checklistState: ChecklistState;
  templateMode: TemplateMode;
}

export interface ChecklistProps {
  checklistState: ChecklistState;
  templateMode: TemplateMode;
}

export interface ChecklistComposerState {
  readonly activeChecklist?: Checklist;
  readonly activeStageIndex?: number;
  readonly activeStepIndex?: number;
  readonly checklistState?: ChecklistState;
  readonly error: any;
  readonly loading: boolean;
  readonly stages?: Partial<Stage>[];
  readonly steps?: Step[];
  readonly templateMode?: TemplateMode;
}

export enum ChecklistComposerAction {
  FETCH_CHECKLIST = '@@checklist/composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@checklist/composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@checklist/composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@checklist/composer/FETCH_CHECKLIST_SUCCESS',

  SET_CHECKLIST_MODE = '@@checklist/composer/SET_CHECKLIST_MODE',
}

export type ChecklistComposerActionType = ReturnType<
  | typeof fetchChecklist
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistError
  | typeof fetchChecklistSuccess
  | typeof setChecklistModes
>;
