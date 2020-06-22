import { apiGetChecklist } from '#utils/apiUrls';
import { request } from '#utils/request';

import { call, put, takeLatest } from 'redux-saga/effects';

import {
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
} from './actions';
import { ChecklistComposerAction } from './types';

function* fetchChecklist(action: any) {
  try {
    yield put(fetchChecklistOngoing());

    // TODO: add type here for API response
    const checklist = yield call(
      request,
      'GET',
      apiGetChecklist(action.payload?.checklistId),
    );
    yield put(fetchChecklistSuccess(checklist.data));
  } catch (error) {
    console.error(
      'error frmo fetchChecklist in checklistCOmposerSaga :: ',
      error,
    );
    yield put(fetchChecklistError(error));
  }
}

export function* ChecklistComposerSaga() {
  yield takeLatest(ChecklistComposerAction.FETCH_CHECKLIST, fetchChecklist);
}
