import { actionSpreader } from '#store/helpers';
import { Error, ResponseObj } from '#utils/globalTypes';
import { Checklist } from '../types';
import { ListViewAction } from './types';

export const fetchChecklists = (
  params: Record<string, string | number>,
  dispatchOngoing = false,
) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS, { params, dispatchOngoing });

export const fetchChecklistsForListView = (
  params: Record<string, string | number>,
  dispatchOngoing: boolean,
) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_FOR_LISTVIEW, {
    params,
    dispatchOngoing,
  });

export const clearData = () => actionSpreader(ListViewAction.CLEAR_DATA);

export const fetchChecklistsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ONGOING);

export const fetchChecklistsSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<Checklist[]>>) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_SUCCESS, {
    data,
    pageable,
  });

export const fetchChecklistsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_ERROR, { error });

export const archiveChecklist = (
  id: Checklist['id'],
  reason: string,
  setFormErrors: (errors?: Error[]) => void,
) =>
  actionSpreader(ListViewAction.ARCHIVE, {
    id,
    reason,
    setFormErrors,
  });

export const unarchiveChecklist = (
  id: Checklist['id'],
  reason: string,
  setFormErrors: (errors?: Error[]) => void,
) =>
  actionSpreader(ListViewAction.UNARCHIVE, {
    id,
    reason,
    setFormErrors,
  });

export const handlePublishedArchive = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.HANDLE_PUBLISHED_ARCHIVE, { id });

export const updateList = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.UPDATE_LIST, { id });
