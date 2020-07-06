import { takeLatest } from 'redux-saga/effects';

import { updateActivity, updateActivityData } from './actions';
import { ActivityAction } from './types';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivity>) {
  console.log('payload from updateActivitySaga :: ', payload);
}

function* updateActivityDataSaga({
  payload,
}: ReturnType<typeof updateActivityData>) {
  console.log('payload from updateActivityDataSaga :: ', payload);
}

export function* ActivitySaga() {
  yield takeLatest(ActivityAction.UPDATE_ACTIVITY_DATA, updateActivityDataSaga);
  yield takeLatest(ActivityAction.UPDATE_ACTIVITY, updateActivitySaga);
}
