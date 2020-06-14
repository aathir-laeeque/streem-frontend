import { put, takeLatest, delay } from 'redux-saga/effects';

import {
  fetchChecklistOngoing,
  fetchCHecklistSuccess,
  fetchChecklistError,
} from './actions';
import { ChecklistComposerAction } from './types';
import { getChecklist } from '../mockData';

function* fetchChecklist(payload: any) {
  try {
    yield put(fetchChecklistOngoing());

    const checklist = getChecklist(payload.payload.checklistId);
    delay(1500);
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
