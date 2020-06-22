import React, { ReactNode } from 'react';
import { takeLatest, call } from 'redux-saga/effects';
import { Check, Close } from '@material-ui/icons';
import { toast } from 'react-toastify';
import {
  NotificationActions,
  NotificationActionType,
  NotificationType,
} from './types';

function* showNotificationGenerator(action: NotificationActionType) {
  const params = action.payload;
  if (params) {
    const Layout = (): ReactNode => (
      <div className={`notification-layout notification--${params.type}`}>
        {params.type === NotificationType.SUCCESS && (
          <Check className={`toast_icon toast_icon--success`} />
        )}
        {params.type === NotificationType.ERROR && (
          <Close className={`toast_icon toast_icon--error`} />
        )}
        {params.msg}
      </div>
    );
    yield call(toast, Layout);
  }
}

export function* showNotificationSaga() {
  yield takeLatest(
    NotificationActions.SHOW_NOTIFICATION,
    showNotificationGenerator,
  );
}
