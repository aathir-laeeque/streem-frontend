import { actionSpreader } from '#store';

import { Checklist, ChecklistState } from '../types';
import { ComposerAction } from './types';

export const fetchChecklist = (checklistId: Checklist['id']) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST, { checklistId });

export const fetchChecklistOngoing = () =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ONGOING);

export const fetchChecklistSuccess = (checklist: Checklist) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_SUCCESS, { checklist });

export const fetchChecklistError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_CHECKLIST_ERROR, { error });

export const setChecklistState = (state: ChecklistState) =>
  actionSpreader(ComposerAction.SET_CHECKLIST_STATE, { state });
