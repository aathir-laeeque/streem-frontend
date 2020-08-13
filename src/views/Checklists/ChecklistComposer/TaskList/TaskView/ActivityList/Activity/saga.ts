import { apiExecuteActivity } from '#utils/apiUrls';
import { request } from '#utils/request';
import {
  call,
  takeLatest,
  select,
  put,
  delay,
  all,
  fork,
} from 'redux-saga/effects';

import { SignatureSaga } from './Signature/saga';
import { executeActivity, updateActivity } from './actions';
import { ActivityAction } from './types';
import { RootState } from '#store/types';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivity>) {
  console.log('payload from updateActivitySaga :: ', payload);
}

function* executeActivitySaga({ payload }: ReturnType<typeof executeActivity>) {
  console.log('payload from executeACtivitySaga :: ', payload);
  const { activity } = payload;

  try {
    const jobId = yield select(
      (state: RootState) => state.checklist.composer.jobId,
    );

    yield delay(800);

    const { data } = yield call(request, 'PUT', apiExecuteActivity(), {
      data: { jobId, activity },
    });

    yield put(updateActivity(data));
  } catch (error) {
    console.error(
      'error came in executeActivitySaga from ActivitySaga => ',
      error,
    );
  }
}

export function* ActivitySaga() {
  yield takeLatest(ActivityAction.UPDATE_ACTIVITY, updateActivitySaga);
  yield takeLatest(ActivityAction.EXECUTE_ACTIVITY, executeActivitySaga);
  yield all([fork(SignatureSaga)]);
}
