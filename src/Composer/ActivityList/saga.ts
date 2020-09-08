import { RootState } from '#store';
import { apiExecuteActivity, apiFixActivity } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from './actions';
import { ActivityListAction } from './types';

function* executeActivitySaga({ payload }: ReturnType<typeof executeActivity>) {
  try {
    console.log('payload from executeActivitySaga :: ', payload);

    const { activity } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data } = yield call(request, 'PUT', apiExecuteActivity(), {
      data: { jobId, activity },
    });

    yield put(updateExecutedActivity(data));
  } catch (error) {
    console.error(
      'error came in the executeActivitySaga in ActivityListSaga :: ',
      error,
    );
  }
}

function* fixActivitySaga({ payload }: ReturnType<typeof fixActivity>) {
  try {
    console.log('payload from fixActivitySaga :: ', payload);

    const { activity } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data } = yield call(request, 'PUT', apiFixActivity(), {
      data: { jobId, activity },
    });

    yield put(updateExecutedActivity(data));
  } catch (error) {
    console.error(
      'error came in the executeActivitySaga in ActivityListSaga :: ',
      error,
    );
  }
}

export function* handleActivityErrorSaga(payload) {
  console.log('came to handleActivityErrorSaga with payload ::: ', payload);
}

export function* ActivityListSaga() {
  yield takeLatest(ActivityListAction.EXECUTE_ACTIVITY, executeActivitySaga);
  yield takeLatest(ActivityListAction.FIX_ACTIVITY, fixActivitySaga);
}
