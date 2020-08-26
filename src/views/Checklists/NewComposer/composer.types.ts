import { RouteComponentProps } from '@reach/router';

import { Checklist } from './checklist.types';
import {
  fetchComposerData,
  fetchComposerDataError,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  resetComposer,
  setComposerState,
} from './composer.action';
import { StageListViewState } from './StageListView/types';
import { TaskListViewState } from './TaskListView/types';
import { Job } from '../../Jobs/types';

// TYPES RELATED TO THE COMPOSER
export enum ComposerState {
  EDIT = 'editing',
  EXECUTED = 'executed',
  EXECUTING = 'executing',
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
  FETCH_COMPOSER_DATA = '@@composer/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/FETCH_COMPOSER_DATA_SUCCESS',

  RESET_COMPOSER = '@@composer/RESET_COMPOSER',

  SET_COMPOSER_STATE = '@@composer/SET_COMPOSER_STATE',

  FETCH_SELECTED_JOB = '@@compsoer/FETCH_SELECTED_JOB',
}

export type ComposerActionType = ReturnType<
  | typeof fetchComposerData
  | typeof fetchComposerDataError
  | typeof fetchComposerDataOngoing
  | typeof fetchComposerDataSuccess
  | typeof resetComposer
  | typeof setComposerState
>;
