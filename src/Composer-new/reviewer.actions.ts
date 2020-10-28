import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { Checklist, ChecklistStates, Comment } from './checklist.types';
import { ComposerAction } from './reducer.types';
import { Collaborator } from './reviewer.types';

// REVIEWER ASSIGNMENT

export const fetchAssignedReviewersForChecklist = (
  checklistId: Checklist['id'],
) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST, { checklistId });

export const fetchAssignedReviewersForChecklistError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST_ERROR, { error });

export const fetchAssignedReviewersForChecklistSuccess = (
  data: Collaborator[],
) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS, {
    data,
  });

export const submitChecklistForReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW, { checklistId });

export const submitChecklistForReviewError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW_ERROR, { error });

export const submitChecklistForReviewSuccess = () =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS);

export const assignReviewerToChecklist = (user: Collaborator) =>
  actionSpreader(ComposerAction.ASSIGN_REVIEWER_TO_CHECKLIST, { user });

export const unAssignReviewerFromChecklist = (user: Collaborator) =>
  actionSpreader(ComposerAction.UNASSIGN_REVIEWER_FROM_CHECKLIST, { user });

export const revertReviewersForChecklist = (users: Collaborator[]) =>
  actionSpreader(ComposerAction.REVERT_REVIEWERS_FOR_CHECKLIST, { users });

export const assignReviewersToChecklist = (payload: {
  checklistId: Checklist['id'];
  assignIds: User['id'][];
  unassignIds: User['id'][];
}) => actionSpreader(ComposerAction.ASSIGN_REVIEWERS_TO_CHECKLIST, payload);

export const assignReviewersToChecklistSuccess = () =>
  actionSpreader(ComposerAction.ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS);

export const assignReviewersToChecklistError = (error: any) =>
  actionSpreader(ComposerAction.ASSIGN_REVIEWERS_TO_CHECKLIST_ERROR, { error });

export const startChecklistReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.START_CHECKLIST_REVIEW, { checklistId });

export const startChecklistReviewSuccess = (collaborators: Collaborator[]) =>
  actionSpreader(ComposerAction.START_CHECKLIST_REVIEW_SUCCESS, {
    collaborators,
  });

export const startChecklistReviewError = (error: any) =>
  actionSpreader(ComposerAction.START_CHECKLIST_REVIEW_ERROR, { error });

export const submitChecklistReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW, { checklistId });

export const submitChecklistReviewSuccess = (
  collaborators: Collaborator[],
  comments: Comment[],
) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_SUCCESS, {
    collaborators,
    comments,
  });

export const submitChecklistReviewError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_ERROR, { error });

export const continueChecklistReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.CONTINUE_CHECKLIST_REVIEW, { checklistId });

export const continueChecklistReviewSuccess = (collaborators: Collaborator[]) =>
  actionSpreader(ComposerAction.CONTINUE_CHECKLIST_REVIEW_SUCCESS, {
    collaborators,
  });

export const continueChecklistReviewError = (error: any) =>
  actionSpreader(ComposerAction.CONTINUE_CHECKLIST_REVIEW_ERROR, { error });

export const submitChecklistReviewWithCR = (
  checklistId: Checklist['id'],
  comments: string,
) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR, {
    checklistId,
    comments,
  });

export const submitChecklistReviewWithCRSuccess = (
  collaborators: Collaborator[],
  comments: Comment[],
) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS, {
    collaborators,
    comments,
  });

export const submitChecklistReviewWithCRError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR, {
    error,
  });

export const updateChecklistState = (state: ChecklistStates) =>
  actionSpreader(ComposerAction.UPDATE_CHECKLIST_STATE, {
    state,
  });

export const sendReviewToCr = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.SEND_REVIEW_TO_CR, { checklistId });

export const sendReviewToCrSuccess = (collaborators: Collaborator[]) =>
  actionSpreader(ComposerAction.SEND_REVIEW_TO_CR_SUCCESS, {
    collaborators,
  });

export const sendReviewToCrError = (error: any) =>
  actionSpreader(ComposerAction.SEND_REVIEW_TO_CR_ERROR, { error });
