import { RootState } from '#store';
import { apiExecuteActivity } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, select, takeLatest } from 'redux-saga/effects';

import { executeActivity } from './actions';
import { ActivityActions } from './types';

function* executeActivitySaga({ payload }: ReturnType<typeof executeActivity>) {
  console.log('payload from executeActivitySaga :: ', payload);
  try {
    const { activity } = payload;

    const { jobId } = yield select((state: RootState) => state.newComposer);

    console.log('jobId :: ', jobId);

    const { data } = yield call(request, 'PUT', apiExecuteActivity(), {
      data: { jobId, activity },
    });
    console.log('data :: ', data);
  } catch (error) {
    console.log('error from executeActivitySaga :: ', error);
  }
}

export function* ActivitySaga() {
  yield takeLatest(ActivityActions.EXECUTE, executeActivitySaga);
}
