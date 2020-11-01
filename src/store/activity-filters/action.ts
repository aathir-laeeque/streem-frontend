import { actionSpreader } from '#store/helpers';
import { ActivityFiltersAction } from './types';

export const setActivityFilters = (payload: { type: string; filter: any }) =>
  actionSpreader(ActivityFiltersAction.SET_FILTERS, payload);

export const clearActivityFilters = () =>
  actionSpreader(ActivityFiltersAction.CLEAR_FILTRES);
