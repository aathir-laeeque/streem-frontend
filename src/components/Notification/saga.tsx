import React, { ReactNode } from 'react';
import { takeLatest, call, delay } from 'redux-saga/effects';
import { Check, Close, SvgIconComponent } from '@material-ui/icons';
import { toast } from 'react-toastify';
import {
  NotificationActions,
  NotificationActionType,
  NotificationType,
} from './types';

function* showNotificationGenerator({ payload }: NotificationActionType) {
  const { type, msg, delayTime, detail, icon, iconProps } = payload;
  if (delayTime) yield delay(delayTime);

  const showIcon = (IconComponent: SvgIconComponent, classes = '') => (
    <IconComponent className={`toast_icon ${classes}`} {...iconProps} />
  );

  const Layout = (): ReactNode => (
    <div className={`notification-layout notification--${type}`}>
      {type === NotificationType.SUCCESS &&
        showIcon(icon || Check, 'toast_icon--success')}
      {type === NotificationType.ERROR &&
        showIcon(icon || Close, 'toast_icon--error')}
      <div className="content">
        {msg}
        {detail && <span>{detail}</span>}
      </div>
    </div>
  );
  yield call(toast, Layout);
}

export function* showNotificationSaga() {
  yield takeLatest(
    NotificationActions.SHOW_NOTIFICATION,
    showNotificationGenerator,
  );
}
