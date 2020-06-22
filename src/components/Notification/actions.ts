import { actionSpreader } from './../../store/helpers';
import { NotificationActions } from './types';

export const showNotification = (params: { type: string; msg: string }) =>
  actionSpreader(NotificationActions.SHOW_NOTIFICATION, params);
