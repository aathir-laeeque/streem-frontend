import { Job } from '#views/Jobs/types';

import {
  fetchComposerDataError,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  resetComposer,
} from './actions';
import {
  fetchAssignedReviewersForChecklistSuccess,
  assignReviewerToChecklist,
  unAssignReviewerFromChecklist,
  revertReviewersForChecklist,
  startChecklistReviewSuccess,
  submitChecklistReviewSuccess,
  continueChecklistReviewSuccess,
  submitChecklistReviewWithCRSuccess,
  updateChecklistState,
  sendReviewToCrSuccess,
} from './reviewer.actions';
import { ActivityListState } from './Activity/reducer.types';
import { Checklist } from './checklist.types';
import { StageListState } from './Stages/reducer.types';
import { TaskListState } from './Tasks/reducer.types';
import { ComposerEntity } from './types';
import { Reviewer } from './reviewer.types';

export type ComposerState = {
  readonly activities: ActivityListState;
  readonly data?: Checklist | Job;
  readonly entity?: ComposerEntity;
  readonly error?: any;
  readonly loading: boolean;
  readonly stages: StageListState;
  readonly tasks: TaskListState;
  readonly reviewers: Reviewer[];
};

export enum ComposerAction {
  FETCH_COMPOSER_DATA = '@@composer/prototype/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/prototype/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/prototype/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/prototype/FETCH_COMPOSER_DATA_SUCCESS',

  RESET_COMPOSER = '@@composer/prototype/RESET_COMPOSER',
  VALIDATE_PROTOTYPE = '@@composer/prototype/validate',

  FETCH_REVIEWERS_FOR_CHECKLIST = '@@composer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST',
  FETCH_REVIEWERS_FOR_CHECKLIST_ERROR = '@@composer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST_ERROR',
  FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS = '@@composer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS',
  ASSIGN_REVIEWERS_TO_CHECKLIST = '@@composer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST',
  UNASSIGN_REVIEWER_FROM_CHECKLIST = '@@composer/prototype/UNASSIGN_REVIEWER_FROM_CHECKLIST',
  ASSIGN_REVIEWER_TO_CHECKLIST = '@@composer/prototype/ASSIGN_REVIEWER_TO_CHECKLIST',
  ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS = '@@composer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS',
  ASSIGN_REVIEWERS_TO_CHECKLIST_ERROR = '@@composer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST_ERROR',
  REVERT_REVIEWERS_FOR_CHECKLIST = '@@composer/prototype/REVERT_REVIEWERS_FOR_CHECKLIST',
  START_CHECKLIST_REVIEW = '@@composer/prototype/START_CHECKLIST_REVIEW',
  START_CHECKLIST_REVIEW_SUCCESS = '@@composer/prototype/START_CHECKLIST_REVIEW_SUCCESS',
  START_CHECKLIST_REVIEW_ERROR = '@@composer/prototype/START_CHECKLIST_REVIEW_ERROR',
  SUBMIT_CHECKLIST_FOR_REVIEW = '@@composer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW',
  SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS = '@@composer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS',
  SUBMIT_CHECKLIST_FOR_REVIEW_ERROR = '@@composer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW_ERROR',
  SUBMIT_CHECKLIST_REVIEW = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW',
  SUBMIT_CHECKLIST_REVIEW_SUCCESS = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW_SUCCESS',
  SUBMIT_CHECKLIST_REVIEW_ERROR = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW_ERROR',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR = '@@composer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR',
  CONTINUE_CHECKLIST_REVIEW = '@@composer/prototype/CONTINUE_CHECKLIST_REVIEW',
  CONTINUE_CHECKLIST_REVIEW_SUCCESS = '@@composer/prototype/CONTINUE_CHECKLIST_REVIEW_SUCCESS',
  CONTINUE_CHECKLIST_REVIEW_ERROR = '@@composer/prototype/CONTINUE_CHECKLIST_REVIEW_ERROR',
  UPDATE_CHECKLIST_STATE = '@@composer/prototype/UPDATE_CHECKLIST_STATE',
  SEND_REVIEW_TO_CR = '@@composer/prototype/SEND_REVIEW_TO_CR',
  SEND_REVIEW_TO_CR_SUCCESS = '@@composer/prototype/SEND_REVIEW_TO_CR_SUCCESS',
  SEND_REVIEW_TO_CR_ERROR = '@@composer/prototype/SEND_REVIEW_TO_CR_ERROR',
}

export type ComposerActionType = ReturnType<
  | typeof fetchComposerDataError
  | typeof fetchComposerDataOngoing
  | typeof fetchComposerDataSuccess
  | typeof resetComposer
  | typeof fetchAssignedReviewersForChecklistSuccess
  | typeof assignReviewerToChecklist
  | typeof unAssignReviewerFromChecklist
  | typeof revertReviewersForChecklist
  | typeof startChecklistReviewSuccess
  | typeof submitChecklistReviewSuccess
  | typeof submitChecklistReviewWithCRSuccess
  | typeof continueChecklistReviewSuccess
  | typeof updateChecklistState
  | typeof sendReviewToCrSuccess
>;
