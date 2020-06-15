import { actionSpreader } from './../../../store/helpers';
import { ChecklistComposerAction } from './types';
import { Checklist } from '../types';

export const fetchChecklist = (checklistId: number) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST, { checklistId });

export const fetchChecklistOngoing = () =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_ONGOING);

export const fetchChecklistError = (error: any) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_ERROR, { error });

export const fetchCHecklistSuccess = (checklist: Checklist) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_SUCCESS, {
    checklist,
  });