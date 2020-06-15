import { call, put, takeLatest } from 'redux-saga/effects';

import { apiGetChecklist } from '../../../utils/apiUrls';
import { request } from './../../../utils/request';
import {
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchCHecklistSuccess,
} from './actions';
import { ChecklistComposerAction } from './types';

function* fetchChecklist(action: any) {
  try {
    yield put(fetchChecklistOngoing());

    const checklist = yield call(
      request,
      'GET',
      apiGetChecklist(action.payload?.checklistId),
    );
    yield put(fetchCHecklistSuccess(checklist.data));
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
