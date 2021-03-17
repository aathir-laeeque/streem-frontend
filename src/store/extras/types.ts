import { setInternetConnectivity } from './action';

export interface ExtrasState {
  readonly connected: boolean;
}

export enum ExtrasAction {
  SET_INTERNET_CONNECTIVITY = '@@extra/SET_INTERNET_CONNECTIVITY',
}

export type ExtrasActionType = ReturnType<typeof setInternetConnectivity>;
