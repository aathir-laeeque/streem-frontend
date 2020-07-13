import { apiGetChecklist, apiGetSelectedJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  fetchChecklist,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  fetchSelectedJob,
} from './actions';
import { StageListSaga } from './StageList/saga';
import { TaskListSaga } from './TaskList/saga';
import { ComposerAction } from './types';

function* fetchChecklistSaga({ payload }: ReturnType<typeof fetchChecklist>) {
  try {
    yield put(fetchChecklistOngoing());

    const { data: checklist } = yield call(
      request,
      'GET',
      apiGetChecklist(payload.checklistId),
    );

    yield put(fetchChecklistSuccess(checklist));
  } catch (error) {
    console.error('error from fetchChecklist saga :: ', error);
  }
}

function* fetchSelectedJobSaga({
  payload,
}: ReturnType<typeof fetchSelectedJob>) {
  console.log('payload from fetchSelectedJobSaga : ', payload);

  try {
    yield put(fetchChecklistOngoing());

    const {
      data: { checklist },
    } = yield call(request, 'GET', apiGetSelectedJob(payload.jobId));

    yield put(fetchChecklistSuccess(checklist));
  } catch (error) {}
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_CHECKLIST, fetchChecklistSaga);
  yield takeLatest(ComposerAction.FETCH_SELSECTED_JOB, fetchSelectedJobSaga);

  yield all([fork(StageListSaga), fork(TaskListSaga)]);
}
