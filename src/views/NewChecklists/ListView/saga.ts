import { delay, put, takeLatest } from 'redux-saga/effects';

import { checklists } from './../mockData';
import {
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
} from './action';
import { ListViewAction } from './types';

function* fetchChecklists() {
  try {
    yield put(fetchChecklistsOngoing());

    const list = checklists;
    yield delay(3000);

    yield put(fetchChecklistsSuccess(list));
  } catch (error) {
    console.error(
      'error from fetchChecklist function in ChecklistListViewSaga :: ',
      error,
    );
    yield put(fetchChecklistsError(error));
  }
}

export function* ChecklistListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_CHECKLISTS, fetchChecklists);
}
