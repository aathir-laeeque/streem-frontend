import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { Checklist } from '../types';
import { ListViewAction } from './types';

export const fetchChecklists = (
  params: Record<string, string | number>,
  dispatchOngoing: boolean,
) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS, { params, dispatchOngoing });

export const fetchChecklistsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ONGOING);

export const fetchChecklistsSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<Checklist>>) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_SUCCESS, {
    data,
    pageable,
  });

export const fetchChecklistsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ERROR, { error });

export const archiveChecklist = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.ARCHIVE, { id });

export const unarchiveChecklist = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.UNARCHIVE, { id });

export const updateList = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.UPDATE_LIST, { id });
