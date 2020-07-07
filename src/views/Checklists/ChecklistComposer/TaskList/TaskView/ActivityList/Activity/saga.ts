import { takeLatest } from 'redux-saga/effects';

import { updateActivity } from './actions';
import { ActivityAction } from './types';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivity>) {
  console.log('payload from updateActivitySaga :: ', payload);
}

export function* ActivitySaga() {
  yield takeLatest(ActivityAction.UPDATE_ACTIVITY, updateActivitySaga);
}
