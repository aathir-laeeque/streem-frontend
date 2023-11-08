import { Block, CheckCircle, Error, SvgIconComponent } from '@material-ui/icons';
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { call, delay, takeLatest } from 'redux-saga/effects';
import { NotificationActions, NotificationActionType, NotificationType } from './types';

function* showNotificationGenerator({ payload }: NotificationActionType) {
  const { type, msg, delayTime, detail, icon, iconProps, autoClose } = payload;
  if (delayTime) yield delay(delayTime);

  const showIcon = (IconComponent: SvgIconComponent, classes = '') => (
    <IconComponent className={`toast_icon ${classes}`} {...iconProps} />
  );

  const Layout = (): ReactNode => (
    <div className={`notification-layout notification--${type}`}>
      {type === NotificationType.SUCCESS && showIcon(icon || CheckCircle, 'toast_icon--success')}
      {type === NotificationType.ERROR && showIcon(icon || Block, 'toast_icon--error')}
      {type === NotificationType.WARNING && showIcon(icon || Error, 'toast_icon--warning')}
      <div className="content">
        {msg}
        {detail && <span>{detail}</span>}
      </div>
    </div>
  );
  yield call(toast, Layout, {
    autoClose: autoClose || 5000,
  });
}

export function* showNotificationSaga() {
  yield takeLatest(NotificationActions.SHOW_NOTIFICATION, showNotificationGenerator);
}
