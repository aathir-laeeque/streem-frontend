import { RouteComponentProps } from '@reach/router';

import { Checklist } from './checklist.types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  fetchSelectedJob,
  resetComposer,
  setComposerState,
} from './composer.action';
import { StageListViewState } from './StageListView/types';
import { TaskListViewState } from './TaskListView/types';
import { Job } from '../../Jobs/types';

// TYPES RELATED TO THE COMPOSER
export enum ComposerState {
  EDIT = 'editing',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
  VIEW = 'viewing',
}

// TYPES RELATED TO COMPOSER COMPONENT
type ComposerDefaultProps = {
  composerState?: ComposerState;
};

export type ComposerProps = RouteComponentProps<{
  checklistId?: string;
  jobId?: string;
}> &
  ComposerDefaultProps;

// TYPES RELATED TO COMPOSER REDUCER
export interface ComposerReducerState {
  checklist?: Checklist;
  composerState: ComposerState;
  // TODO: fix this unknown type
  error: unknown;
  jobId?: Job['id'];
  loading: boolean;
  stages: StageListViewState;
  tasks: TaskListViewState;
}

// TYPES RELATED TO COMPOSER ACTION
export enum ComposerAction {
  FETCH_CHECKLIST = '@@composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@composer/FETCH_CHECKLIST_SUCCESS',

  RESET_COMPOSER = '@@composer/RESET_COMPOSER',

  SET_COMPOSER_STATE = '@@composer/SET_COMPOSER_STATE',

  FETCH_SELECTED_JOB = '@@compsoer/FETCH_SELECTED_JOB',
}

export type ComposerActionType = ReturnType<
  | typeof fetchChecklist
  | typeof fetchChecklistError
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistSuccess
  | typeof fetchSelectedJob
  | typeof resetComposer
  | typeof setComposerState
>;
