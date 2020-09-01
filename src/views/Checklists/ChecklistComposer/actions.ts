import { actionSpreader } from '#store';

import { Checklist, ChecklistState } from '../types';
import { ComposerAction } from './types';
import { Job } from '../../Jobs/types';
import { Users } from '#store/users/types';

export const fetchChecklist = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST, { checklistId });

export const fetchChecklistOngoing = () =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ONGOING);

export const fetchChecklistSuccess = (checklist: Checklist) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_SUCCESS, { checklist });

export const fetchChecklistSuccessSetUsers = ({
  users,
  extras,
}: {
  users: Users;
  extras: any;
}) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_SUCCESS_SET_USERS, {
    users,
    extras,
  });

export const fetchChecklistError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ERROR, { error });

export const setChecklistState = (state: ChecklistState) =>
  actionSpreader(ComposerAction.SET_CHECKLIST_STATE, { state });

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);

export const fetchSelectedJob = (jobId: Job['id']) =>
  actionSpreader(ComposerAction.FETCH_SELSECTED_JOB, { jobId });
