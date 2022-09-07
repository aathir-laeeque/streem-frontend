import { actionSpreader } from '#store/helpers';
import { ExtrasAction } from './types';

export const setInternetConnectivity = ({ connected }: { connected: boolean }) =>
  actionSpreader(ExtrasAction.SET_INTERNET_CONNECTIVITY, { connected });

export const setGlobalError = (hasError: boolean) =>
  actionSpreader(ExtrasAction.SET_GLOBAL_ERROR, { hasError });

export const setRecentServerTimestamp = (timestamp: number) =>
  actionSpreader(ExtrasAction.SET_RECENT_SERVER_TIMESTAMP, { timestamp });
