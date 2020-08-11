import { actionSpreader } from '#store';

import { Job } from '../../Jobs/types';
import { Checklist } from './checklist.types';
import { ComposerAction, ComposerState } from './composer.types';

export const fetchChecklist = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST, { checklistId });

export const fetchChecklistOngoing = () =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ONGOING);

export const fetchChecklistSuccess = (checklist: Checklist) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_SUCCESS, { checklist });

export const fetchChecklistError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ERROR, { error });

export const setComposerState = (state: ComposerState) =>
  actionSpreader(ComposerAction.SET_COMPOSER_STATE, { state });

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);

export const fetchSelectedJob = (jobId: Job['id']) =>
  actionSpreader(ComposerAction.FETCH_SELECTED_JOB, { jobId });
