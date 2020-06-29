import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  setChecklistState,
} from './actions';
import { setActiveStage, updateStage } from './StageList/actions';
import { Stage } from './StageList/types';
import { setActiveStep } from './StepsList/StepView/actions';
import { updateInteractionInRedux } from './StepsList/StepView/InteractionsList/actions';

export enum ChecklistState {
  ADD_EDIT = 'add/edit',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
}

export interface ComposerProps extends RouteComponentProps {
  checklistId: string;
  checklistState: ChecklistState;
}

export interface ComposerState {
  activeStageIndex: number;
  activeStepIndex: number;
  checklist?: Checklist;
  error: unknown;
  loading: boolean;
  stages: Stage[] | [];
  steps: any;
  state: ChecklistState;
}

export enum ComposerAction {
  FETCH_CHECKLIST = '@@checklist/composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@checklist/composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@checklist/composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@checklist/composer/FETCH_CHECKLIST_SUCCESS',
  SET_CHECKLIST_STATE = '@@checklist/composer/SET_CHECKLIST_STATE',
}

export type ComposerActionType = ReturnType<
  | typeof fetchChecklist
  | typeof fetchChecklistError
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistSuccess
  | typeof setChecklistState
  | typeof setActiveStage
  | typeof updateStage
  | typeof setActiveStep
  | typeof updateInteractionInRedux
>;
