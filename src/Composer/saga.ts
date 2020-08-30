import { apiGetChecklist, apiGetSelectedJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  completeJob,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  startJob,
} from './actions';
import { StageListSaga } from './StageList/saga';
import { TaskListSaga } from './TaskList/saga';
import { ComposerAction, Entity } from './types';

function* fetchDataSaga({ payload }: ReturnType<typeof fetchData>) {
  console.log('came to new composer data fetch saga with payload :: ', payload);
  try {
    const { id, entity } = payload;

    yield put(fetchDataOngoing());

    const { data } = yield call(
      request,
      'GET',
      entity === Entity.CHECKLIST ? apiGetChecklist(id) : apiGetSelectedJob(id),
    );

    yield put(fetchDataSuccess(data, entity));
  } catch (error) {
    console.log('error from fetchDataSaga in ComposerSaga :: ', error);
  }
}

function* startJobSaga({ payload }: ReturnType<typeof startJob>) {
  console.log('make api call to start the job here');
  console.log('payload for start job :: ', payload);
}

function* completeJobSaga({ payload }: ReturnType<typeof completeJob>) {
  if (payload.withException) {
    console.log('make api call to complete the job with exception here');
  } else {
    console.log('make api call to complete the job here');
  }
}

function* publishChecklistSaga() {
  console.log('make api call to publish checklist here');
}

function* restartJobSaga() {
  console.log('make api call to restart the job here');
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLatest(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLatest(ComposerAction.COMPLETE_JOB_WITH_EXCEPTION, completeJobSaga);
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);
  yield takeLatest(ComposerAction.RESTART_JOB, restartJobSaga);

  yield takeLatest(ComposerAction.PUBLISH_CHECKLIST, publishChecklistSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
  ]);
}
