import { ListViewAction } from './types';
import { actionSpreader } from './../../../store/helpers';
import { Checklist } from '../types';

export const fetchChecklists = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS);

export const fetchChecklistsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ONGOING);

export const fetchChecklistsSuccess = (checklists: Checklist[]) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_SUCCESS, { checklists });

export const fetchChecklistsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ERROR, { error });
