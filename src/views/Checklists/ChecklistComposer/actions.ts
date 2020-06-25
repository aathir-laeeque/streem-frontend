import { actionSpreader } from '#store';

import { Checklist } from '../types';
import { ChecklistComposerAction, ChecklistState, TemplateMode } from './types';

export const fetchChecklist = (checklistId: Checklist['id']) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST, { checklistId });

export const fetchChecklistOngoing = () =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_ONGOING);

export const fetchChecklistError = (error: any) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_ERROR, { error });

export const fetchChecklistSuccess = (checklist: Checklist) =>
  actionSpreader(ChecklistComposerAction.FETCH_CHECKLIST_SUCCESS, {
    checklist,
  });

export const setChecklistModes = ({
  checklistState,
  templateMode,
}: {
  checklistState: ChecklistState;
  templateMode: TemplateMode;
}) =>
  actionSpreader(ChecklistComposerAction.SET_CHECKLIST_MODE, {
    checklistState,
    templateMode,
  });
