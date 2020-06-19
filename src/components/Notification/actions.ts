import { actionSpreader } from './../../store/helpers';
import { NotificationAction } from './types';

export const showNotification = (params: { type: string; msg: string }) =>
  actionSpreader(NotificationAction.SHOW_NOTIFICATION, params);
