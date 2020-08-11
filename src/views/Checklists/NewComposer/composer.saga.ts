import { apiGetChecklist, apiGetSelectedJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  fetchSelectedJob,
} from './composer.action';
import { ComposerAction } from './composer.types';

function* fetchChecklistSaga({ payload }: ReturnType<typeof fetchChecklist>) {
  console.log('payload from fetchChecklistSaga  :: >> ', payload);

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
  console.log('payload from fetchSelectedJobSaga : ', payload);

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
}
