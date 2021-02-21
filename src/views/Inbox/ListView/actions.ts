import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { Job } from '#views/Jobs/NewListView/types';

import { ListViewAction } from './types';

export const fetchInbox = (
  params: Record<string, string | number>,
  type: string,
) => actionSpreader(ListViewAction.FETCH_INBOX, { params, type });

export const fetchInboxOngoing = () =>
  actionSpreader(ListViewAction.FETCH_INBOX_ONGOING);

export const fetchInboxSuccess = (
  { data, pageable }: Partial<ResponseObj<Job[]>>,
  type: string,
) =>
  actionSpreader(ListViewAction.FETCH_INBOX_SUCCESS, { data, pageable, type });

export const fetchInboxError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_INBOX_ERROR, { error });

export const setSelectedState = (state: string) =>
  actionSpreader(ListViewAction.SET_SELECTED_STATE, { state });

export const resetInbox = () => actionSpreader(ListViewAction.RESET_INBOX);
