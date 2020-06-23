import { ListViewAction } from './types';
import { actionSpreader } from '../../../store/helpers';
import { ChecklistsObj } from '../types';

export const fetchChecklists = (params: { page: number; size: number }) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS, params);

export const fetchChecklistsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ONGOING);

export const fetchChecklistsSuccess = (checklists: ChecklistsObj) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_SUCCESS, { checklists });

export const fetchChecklistsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ERROR, { error });
