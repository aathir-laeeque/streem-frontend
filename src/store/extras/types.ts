import {
  setGlobalError,
  setInternetConnectivity,
  setRecentServerTimestamp,
  toggleIsDrawerOpen,
} from './action';

export interface ExtrasState {
  readonly connected: boolean;
  readonly hasGlobalError: boolean;
  readonly recentServerTimestamp?: number;
  readonly isDrawerOpen: boolean;
}

export enum ExtrasAction {
  SET_INTERNET_CONNECTIVITY = '@@extra/SET_INTERNET_CONNECTIVITY',
  SET_GLOBAL_ERROR = '@@extra/SET_GLOBAL_ERROR',
  SET_RECENT_SERVER_TIMESTAMP = '@@extra/SET_RECENT_SERVER_TIMESTAMP',
  TOGGLE_IS_DRAWER_OPEN = '@@extra/TOGGLE_IS_DRAWER_OPEN',
}

export type ExtrasActionType = ReturnType<
  | typeof setInternetConnectivity
  | typeof setGlobalError
  | typeof setRecentServerTimestamp
  | typeof toggleIsDrawerOpen
>;
