import { takeLatest, select, call, put } from 'redux-saga/effects';
import { ActivityListAction } from './types';
import { executeActivity, updateExecutedActivity } from './actions';
import { RootState } from '#store';
import { request } from '#utils/request';
import { apiExecuteActivity } from '#utils/apiUrls';

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

export function* handleActivityErrorSaga(payload) {
  console.log('came to handleActivityErrorSaga with payload ::: ', payload);
}

export function* ActivityListSaga() {
  yield takeLatest(ActivityListAction.EXECUTE_ACTIVITY, executeActivitySaga);
}
