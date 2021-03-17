import { actionSpreader } from '#store/helpers';
import { ExtrasAction } from './types';

export const setInternetConnectivity = ({
  connected,
}: {
  connected: boolean;
}) => actionSpreader(ExtrasAction.SET_INTERNET_CONNECTIVITY, { connected });
