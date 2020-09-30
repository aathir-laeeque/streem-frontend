import { Job } from '#views/Jobs/types';

import {
  fetchComposerDataError,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  resetComposer,
} from './actions';
import { ActivityListState } from './Activity/reducer.types';
import { Checklist } from './checklist.types';
import { StageListState } from './Stages/reducer.types';
import { TaskListState } from './Tasks/reducer.types';
import { ComposerEntity } from './types';

export type ComposerState = {
  readonly activities: ActivityListState;
  readonly data?: Checklist | Job;
  readonly entity?: ComposerEntity;
  readonly error?: any;
  readonly loading: boolean;
  readonly stages: StageListState;
  readonly tasks: TaskListState;
};

export enum ComposerAction {
  FETCH_COMPOSER_DATA = '@@composer/prototype/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/prototype/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/prototype/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/prototype/FETCH_COMPOSER_DATA_SUCCESS',

  RESET_COMPOSER = '@@composer/prototype/RESET_COMPOSER',
}

export type ComposerActionType = ReturnType<
  | typeof fetchComposerDataError
  | typeof fetchComposerDataOngoing
  | typeof fetchComposerDataSuccess
  | typeof resetComposer
>;
