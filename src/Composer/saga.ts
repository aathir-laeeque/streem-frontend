import {
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
  apiCompleteJob,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';

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
import { ActivityListSaga } from './ActivityList/saga';
import { RootState } from '#store';

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
  try {
    console.log('make api call to start the job here');
    console.log('payload for start job :: ', payload);
    const { jobId } = payload;

    const data = yield call(request, 'PUT', apiStartJob(jobId, 'start'));
    console.log('data  ::', data);
  } catch (error) {
    console.error('error came in startJobSaga in ComposerSaga :: ', error);
  }
}

function* completeJobSaga({ payload }: ReturnType<typeof completeJob>) {
  console.log('came to completeJob saga with  payload :: ', payload);
  try {
    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data } = yield call(
      request,
      'PUT',
      apiCompleteJob(payload.withException, jobId),
    );

    console.log('data on complete job :: ', data);
  } catch (error) {
    console.error('error came in completeJobSaga in ComposerSaga :: ', error);
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
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);
  yield takeLatest(ComposerAction.RESTART_JOB, restartJobSaga);

  yield takeLatest(ComposerAction.PUBLISH_CHECKLIST, publishChecklistSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ActivityListSaga),
  ]);
}
