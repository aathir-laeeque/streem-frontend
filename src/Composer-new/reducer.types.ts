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
  submitChecklistForReviewSuccess,
  submitChecklistReviewSuccess,
  submitChecklistReviewWithCRSuccess,
  updateChecklistState,
  sendReviewToCrSuccess,
  assignReviewersToChecklistSuccess,
  fetchApproversSuccess,
  signOffPrototypeSuccess,
  initiateSignOffSuccess,
} from './reviewer.actions';
import { ActivityListState } from './Activity/reducer.types';
import { Checklist } from './checklist.types';
import { StageListState } from './Stages/reducer.types';
import { TaskListState } from './Tasks/reducer.types';
import { ComposerEntity } from './types';
import { Collaborator } from './reviewer.types';

export type ComposerState = {
  readonly activities: ActivityListState;
  readonly data?: Checklist | Job;
  readonly entity?: ComposerEntity;
  readonly error?: any;
  readonly loading: boolean;
  readonly stages: StageListState;
  readonly tasks: TaskListState;
  readonly collaborators: Collaborator[];
  readonly approvers: Collaborator[];
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
  FETCH_APPROVERS = '@@composer/prototype/FETCH_APPROVERS',
  FETCH_APPROVERS_ERROR = '@@composer/prototype/FETCH_APPROVERS_ERROR',
  FETCH_APPROVERS_SUCCESS = '@@composer/prototype/FETCH_APPROVERS_SUCCESS',
  SIGN_OFF_PROTOTYPE = '@@composer/prototype/SIGN_OFF_PROTOTYPE',
  SIGN_OFF_PROTOTYPE_ERROR = '@@composer/prototype/SIGN_OFF_PROTOTYPE_ERROR',
  SIGN_OFF_PROTOTYPE_SUCCESS = '@@composer/prototype/SIGN_OFF_PROTOTYPE_SUCCESS',
  RELEASE_PROTOTYPE = '@@composer/prototype/RELEASE_PROTOTYPE',
  RELEASE_PROTOTYPE_ERROR = '@@composer/prototype/RELEASE_PROTOTYPE_ERROR',
  RELEASE_PROTOTYPE_SUCCESS = '@@composer/prototype/RELEASE_PROTOTYPE_SUCCESS',
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
  UPDATE_CHECKLIST_STATE = '@@composer/prototype/UPDATE_CHECKLIST_STATE',
  SEND_REVIEW_TO_CR = '@@composer/prototype/SEND_REVIEW_TO_CR',
  SEND_REVIEW_TO_CR_SUCCESS = '@@composer/prototype/SEND_REVIEW_TO_CR_SUCCESS',
  SEND_REVIEW_TO_CR_ERROR = '@@composer/prototype/SEND_REVIEW_TO_CR_ERROR',
  INITIATE_SIGNOFF = '@@composer/prototype/INITIATE_SIGNOFF',
  INITIATE_SIGNOFF_SUCCESS = '@@composer/prototype/INITIATE_SIGNOFF_SUCCESS',
  INITIATE_SIGNOFF_ERROR = '@@composer/prototype/INITIATE_SIGNOFF_ERROR',
}

export type ComposerActionType = ReturnType<
  | typeof fetchComposerDataError
  | typeof fetchComposerDataOngoing
  | typeof fetchComposerDataSuccess
  | typeof resetComposer
  | typeof fetchAssignedReviewersForChecklistSuccess
  | typeof fetchApproversSuccess
  | typeof assignReviewerToChecklist
  | typeof unAssignReviewerFromChecklist
  | typeof revertReviewersForChecklist
  | typeof startChecklistReviewSuccess
  | typeof submitChecklistReviewSuccess
  | typeof submitChecklistReviewWithCRSuccess
  | typeof submitChecklistForReviewSuccess
  | typeof updateChecklistState
  | typeof sendReviewToCrSuccess
  | typeof assignReviewersToChecklistSuccess
  | typeof signOffPrototypeSuccess
  | typeof initiateSignOffSuccess
>;
