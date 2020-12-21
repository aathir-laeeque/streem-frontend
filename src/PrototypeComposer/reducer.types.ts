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
  FETCH_COMPOSER_DATA = '@@prototypeComposer/prototype/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@prototypeComposer/prototype/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@prototypeComposer/prototype/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@prototypeComposer/prototype/FETCH_COMPOSER_DATA_SUCCESS',

  RESET_COMPOSER = '@@prototypeComposer/prototype/RESET_COMPOSER',
  VALIDATE_PROTOTYPE = '@@prototypeComposer/prototype/validate',

  FETCH_REVIEWERS_FOR_CHECKLIST = '@@prototypeComposer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST',
  FETCH_REVIEWERS_FOR_CHECKLIST_ERROR = '@@prototypeComposer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST_ERROR',
  FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS = '@@prototypeComposer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS',
  FETCH_APPROVERS = '@@prototypeComposer/prototype/FETCH_APPROVERS',
  FETCH_APPROVERS_ERROR = '@@prototypeComposer/prototype/FETCH_APPROVERS_ERROR',
  FETCH_APPROVERS_SUCCESS = '@@prototypeComposer/prototype/FETCH_APPROVERS_SUCCESS',
  SIGN_OFF_PROTOTYPE = '@@prototypeComposer/prototype/SIGN_OFF_PROTOTYPE',
  SIGN_OFF_PROTOTYPE_ERROR = '@@prototypeComposer/prototype/SIGN_OFF_PROTOTYPE_ERROR',
  SIGN_OFF_PROTOTYPE_SUCCESS = '@@prototypeComposer/prototype/SIGN_OFF_PROTOTYPE_SUCCESS',
  RELEASE_PROTOTYPE = '@@prototypeComposer/prototype/RELEASE_PROTOTYPE',
  RELEASE_PROTOTYPE_ERROR = '@@prototypeComposer/prototype/RELEASE_PROTOTYPE_ERROR',
  RELEASE_PROTOTYPE_SUCCESS = '@@prototypeComposer/prototype/RELEASE_PROTOTYPE_SUCCESS',
  ASSIGN_REVIEWERS_TO_CHECKLIST = '@@prototypeComposer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST',
  UNASSIGN_REVIEWER_FROM_CHECKLIST = '@@prototypeComposer/prototype/UNASSIGN_REVIEWER_FROM_CHECKLIST',
  ASSIGN_REVIEWER_TO_CHECKLIST = '@@prototypeComposer/prototype/ASSIGN_REVIEWER_TO_CHECKLIST',
  ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS = '@@prototypeComposer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS',
  ASSIGN_REVIEWERS_TO_CHECKLIST_ERROR = '@@prototypeComposer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST_ERROR',
  REVERT_REVIEWERS_FOR_CHECKLIST = '@@prototypeComposer/prototype/REVERT_REVIEWERS_FOR_CHECKLIST',
  START_CHECKLIST_REVIEW = '@@prototypeComposer/prototype/START_CHECKLIST_REVIEW',
  START_CHECKLIST_REVIEW_SUCCESS = '@@prototypeComposer/prototype/START_CHECKLIST_REVIEW_SUCCESS',
  START_CHECKLIST_REVIEW_ERROR = '@@prototypeComposer/prototype/START_CHECKLIST_REVIEW_ERROR',
  SUBMIT_CHECKLIST_FOR_REVIEW = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW',
  SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS',
  SUBMIT_CHECKLIST_FOR_REVIEW_ERROR = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW_ERROR',
  SUBMIT_CHECKLIST_REVIEW = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW',
  SUBMIT_CHECKLIST_REVIEW_SUCCESS = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_SUCCESS',
  SUBMIT_CHECKLIST_REVIEW_ERROR = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_ERROR',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR',
  UPDATE_CHECKLIST_STATE = '@@prototypeComposer/prototype/UPDATE_CHECKLIST_STATE',
  SEND_REVIEW_TO_CR = '@@prototypeComposer/prototype/SEND_REVIEW_TO_CR',
  SEND_REVIEW_TO_CR_SUCCESS = '@@prototypeComposer/prototype/SEND_REVIEW_TO_CR_SUCCESS',
  SEND_REVIEW_TO_CR_ERROR = '@@prototypeComposer/prototype/SEND_REVIEW_TO_CR_ERROR',
  INITIATE_SIGNOFF = '@@prototypeComposer/prototype/INITIATE_SIGNOFF',
  INITIATE_SIGNOFF_SUCCESS = '@@prototypeComposer/prototype/INITIATE_SIGNOFF_SUCCESS',
  INITIATE_SIGNOFF_ERROR = '@@prototypeComposer/prototype/INITIATE_SIGNOFF_ERROR',
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
