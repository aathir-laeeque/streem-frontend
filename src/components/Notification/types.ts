import { showNotification } from './actions';

export enum NotificationAction {
  SHOW_NOTIFICATION = '@@notification/SHOW_NOTIFICATION',
}

export type NotificationActionType = ReturnType<typeof showNotification>;

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}
