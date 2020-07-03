import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { Checklist } from '../types';
import { ListViewAction } from './types';

export const fetchChecklists = (params: { page: number; size: number }) =>
  actionSpreader(ListViewAction.FETCH_CHECKLISTS, params);

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
