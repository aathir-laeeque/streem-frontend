import { actionSpreader } from '#store/helpers';
import { Error, ResponseObj } from '#utils/globalTypes';
import { Checklist } from '../types';
import { Automation, ListViewAction } from './types';

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

export const fetchAutomations = (params: Record<string, string | number>) =>
  actionSpreader(ListViewAction.FETCH_AUTOMATIONS, { params });

export const fetchAutomationsError = (error?: any) =>
  actionSpreader(ListViewAction.FETCH_AUTOMATIONS_ERROR, { error });

export const fetchAutomationsSuccess = ({ data, pageable }: Partial<ResponseObj<Automation[]>>) =>
  actionSpreader(ListViewAction.FETCH_AUTOMATIONS_SUCCESS, {
    data,
    pageable,
  });

export const fetchProcessLogs = (id: Checklist['id']) =>
  actionSpreader(ListViewAction.FETCH_PROCESS_LOGS, { id });

export const fetchProcessLogsError = (error?: any) =>
  actionSpreader(ListViewAction.FETCH_PROCESS_LOGS_ERROR, { error });

export const fetchProcessLogsSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<any[]>>) =>
  actionSpreader(ListViewAction.FETCH_PROCESS_LOGS_SUCCESS, {
    data,
    pageable,
  });
