import { setActivityFilters, clearActivityFilters } from './action';

export interface ActivityFiltersState {
  readonly filters: Record<string, any>;
}

export enum ActivityFiltersAction {
  SET_FILTERS = '@@activityFilters/SET_FILTERS',
  CLEAR_FILTRES = '@@activityFilters/CLEAR_FILTRES',
}

export type ActivityFiltersActionType = ReturnType<
  typeof setActivityFilters | typeof clearActivityFilters
>;