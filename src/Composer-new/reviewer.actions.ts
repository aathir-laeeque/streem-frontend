import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { Checklist, Comment } from './checklist.types';
import { ComposerAction } from './reducer.types';
import { Reviewer } from './reviewer.types';

// REVIEWER ASSIGNMENT

export const fetchAssignedReviewersForChecklist = (
  checklistId: Checklist['id'],
) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST, { checklistId });

export const fetchAssignedReviewersForChecklistError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST_ERROR, { error });

export const fetchAssignedReviewersForChecklistSuccess = (data: Reviewer[]) =>
  actionSpreader(ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS, {
    data,
  });

export const submitChecklistForReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW, { checklistId });

export const submitChecklistForReviewError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW_ERROR, { error });

export const submitChecklistForReviewSuccess = () =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS);

export const assignReviewerToChecklist = (user: Reviewer) =>
  actionSpreader(ComposerAction.ASSIGN_REVIEWER_TO_CHECKLIST, { user });

export const unAssignReviewerFromChecklist = (user: Reviewer) =>
  actionSpreader(ComposerAction.UNASSIGN_REVIEWER_FROM_CHECKLIST, { user });

export const revertReviewersForChecklist = (users: Reviewer[]) =>
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

export const startChecklistReviewSuccess = (reviewers: Reviewer[]) =>
  actionSpreader(ComposerAction.START_CHECKLIST_REVIEW_SUCCESS, { reviewers });

export const startChecklistReviewError = (error: any) =>
  actionSpreader(ComposerAction.START_CHECKLIST_REVIEW_ERROR, { error });

export const submitChecklistReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW, { checklistId });

export const submitChecklistReviewSuccess = (
  reviewers: Reviewer[],
  comments: Comment[],
) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_SUCCESS, {
    reviewers,
    comments,
  });

export const submitChecklistReviewError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_ERROR, { error });

export const continueChecklistReview = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.CONTINUE_CHECKLIST_REVIEW, { checklistId });

export const continueChecklistReviewSuccess = (reviewers: Reviewer[]) =>
  actionSpreader(ComposerAction.CONTINUE_CHECKLIST_REVIEW_SUCCESS, {
    reviewers,
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
  reviewers: Reviewer[],
  comments: Comment[],
) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS, {
    reviewers,
    comments,
  });

export const submitChecklistReviewWithCRError = (error: any) =>
  actionSpreader(ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_ERROR, {
    error,
  });
