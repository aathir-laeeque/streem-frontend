/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { actionSpreader } from '../../store/helpers';
import { Checklist, ChecklistActionTypes } from './types';

export const loadChecklists = () =>
  actionSpreader(ChecklistActionTypes.LOAD_CHECKLISTS);

export const loadChecklistsOngoing = () =>
  actionSpreader(ChecklistActionTypes.LOAD_CHECKLISTS_ONGOING);

export const loadChecklistsSuccess = (checklists: Checklist[]) =>
  actionSpreader(ChecklistActionTypes.LOAD_CHECKLISTS_SUCCESS, { checklists });

export const loadChecklistsError = (error: any) =>
  actionSpreader(ChecklistActionTypes.LOAD_CHECKLISTS_ERROR, { error });

export const setSelectedChecklist = (checklistId?: string | number) =>
  actionSpreader(ChecklistActionTypes.SET_SELECTED_CHECKLIST, { checklistId });
