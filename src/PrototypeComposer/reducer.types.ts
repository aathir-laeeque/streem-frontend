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
  updateChecklistForReview,
  fetchApproversSuccess,
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
  FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS = '@@prototypeComposer/prototype/FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS',
  FETCH_APPROVERS = '@@prototypeComposer/prototype/FETCH_APPROVERS',
  FETCH_APPROVERS_SUCCESS = '@@prototypeComposer/prototype/FETCH_APPROVERS_SUCCESS',
  SIGN_OFF_PROTOTYPE = '@@prototypeComposer/prototype/SIGN_OFF_PROTOTYPE',
  RELEASE_PROTOTYPE = '@@prototypeComposer/prototype/RELEASE_PROTOTYPE',
  ASSIGN_REVIEWERS_TO_CHECKLIST = '@@prototypeComposer/prototype/ASSIGN_REVIEWERS_TO_CHECKLIST',
  UNASSIGN_REVIEWER_FROM_CHECKLIST = '@@prototypeComposer/prototype/UNASSIGN_REVIEWER_FROM_CHECKLIST',
  ASSIGN_REVIEWER_TO_CHECKLIST = '@@prototypeComposer/prototype/ASSIGN_REVIEWER_TO_CHECKLIST',
  REVERT_REVIEWERS_FOR_CHECKLIST = '@@prototypeComposer/prototype/REVERT_REVIEWERS_FOR_CHECKLIST',
  START_CHECKLIST_REVIEW = '@@prototypeComposer/prototype/START_CHECKLIST_REVIEW',
  UPDATE_FOR_REVIEW_PROCESS = '@@prototypeComposer/prototype/UPDATE_FOR_REVIEW_PROCESS',
  SUBMIT_CHECKLIST_FOR_REVIEW = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_FOR_REVIEW',
  SUBMIT_CHECKLIST_REVIEW = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW',
  SUBMIT_CHECKLIST_REVIEW_WITH_CR = '@@prototypeComposer/prototype/SUBMIT_CHECKLIST_REVIEW_WITH_CR',
  SEND_REVIEW_TO_CR = '@@prototypeComposer/prototype/SEND_REVIEW_TO_CR',
  INITIATE_SIGNOFF = '@@prototypeComposer/prototype/INITIATE_SIGNOFF',
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
  | typeof updateChecklistForReview
>;
