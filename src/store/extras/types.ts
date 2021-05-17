import { setGlobalError, setInternetConnectivity } from './action';

export interface ExtrasState {
  readonly connected: boolean;
  readonly hasGlobalError: boolean;
}

export enum ExtrasAction {
  SET_INTERNET_CONNECTIVITY = '@@extra/SET_INTERNET_CONNECTIVITY',
  SET_GLOBAL_ERROR = '@@extra/SET_GLOBAL_ERROR',
}

export type ExtrasActionType = ReturnType<
  typeof setInternetConnectivity | typeof setGlobalError
>;
