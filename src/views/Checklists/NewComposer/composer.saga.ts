import { apiGetChecklist, apiGetSelectedJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  fetchSelectedJob,
} from './composer.action';
import { ComposerAction } from './composer.types';
import { TaskListViewSaga } from './taskListView.saga';

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
    console.log('Error from fetchChecklistSaga :: ', error);

    yield put(fetchChecklistError(error));
  }
}

function* fetchSelectedJobSaga({
  payload,
}: ReturnType<typeof fetchSelectedJob>) {
  try {
    yield put(fetchChecklistOngoing());

    const {
      data: { checklist },
    } = yield call(request, 'GET', apiGetSelectedJob(payload.jobId));

    yield put(fetchChecklistSuccess(checklist));
  } catch (error) {
    console.log('Error from fetchSelectedJobSaga :: ', error);

    yield put(fetchChecklistError(error));
  }
}

export function* NewComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_CHECKLIST, fetchChecklistSaga);
  yield takeLatest(ComposerAction.FETCH_SELECTED_JOB, fetchSelectedJobSaga);

  yield all([
    // FORK ALL COMPOSER RELATED SAGA HERE
    fork(TaskListViewSaga),
  ]);
}
