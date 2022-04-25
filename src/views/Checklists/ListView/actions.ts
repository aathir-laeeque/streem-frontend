import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { Checklist } from '../types';
import { ListViewAction } from './types';

export const fetchChecklists = (
  params: Record<string, string | number>,
  enableLoading: boolean,
) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS, {
    params,
    enableLoading,
  });

export const fetchChecklistsForListView = (
  params: Record<string, string | number>,
) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS_FOR_LISTVIEW, {
    params,
    enableLoading: true,
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

export const archiveChecklist = (id: Checklist['id'], showPopup?: boolean) =>
  actionSpreader(ListViewAction.ARCHIVE, { id, showPopup });

export const unarchiveChecklist = (id: Checklist['id'], showPopup?: boolean) =>
  actionSpreader(ListViewAction.UNARCHIVE, { id, showPopup });

export const handlePublishedArchive = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.HANDLE_PUBLISHED_ARCHIVE, { id });

export const updateList = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.UPDATE_LIST, { id });
