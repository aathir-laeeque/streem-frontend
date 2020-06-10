import { delay, put, takeLatest } from 'redux-saga/effects';

import {
  loadChecklistsError,
  loadChecklistsOngoing,
  loadChecklistsSuccess,
} from './actions';
import { generateMockData } from './mock_data';
import { ChecklistActionTypes } from './types';

function* fetchChecklistSaga() {
  try {
    yield put(loadChecklistsOngoing());

    const mockData = generateMockData();
    yield delay(5000);

    console.log('mockData :: ', mockData);

    yield put(loadChecklistsSuccess(mockData));
  } catch (error) {
    console.error('error from fetchChecklistSaga :: ', error);
    yield put(loadChecklistsError(error));
  }
}

export default function* checklistSaga() {
  yield takeLatest(ChecklistActionTypes.LOAD_CHECKLISTS, fetchChecklistSaga);
}
