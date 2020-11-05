import { actionSpreader } from '#store/helpers';
import { ActivityFiltersAction } from './types';

export const setActivityFilters = (payload: string) =>
  actionSpreader(ActivityFiltersAction.SET_FILTERS, payload);

export const clearActivityFilters = () =>
  actionSpreader(ActivityFiltersAction.CLEAR_FILTRES);
