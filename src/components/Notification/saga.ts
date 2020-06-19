import { takeLatest } from 'redux-saga/effects';
import { NotificationAction, NotificationActionType } from './types';

function* showNotificationGenerator(action: NotificationActionType) {
  const params = action.payload;
  if (params) {
    console.log('params', params);
  }
}

export function* showNotificationSaga() {
  yield takeLatest(
    NotificationAction.SHOW_NOTIFICATION,
    showNotificationGenerator,
  );
}
