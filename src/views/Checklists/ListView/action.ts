import { actionSpreader } from '#store';

import { Checklist } from '../types';
import { ListViewAction } from './types';

export const fetchChecklists = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS);

export const fetchChecklistsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ONGOING);

export const fetchChecklistsSuccess = (checklists: Checklist[]) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_SUCCESS, { checklists });

export const fetchChecklistsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ERROR, { error });
