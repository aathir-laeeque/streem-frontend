import { put, takeLatest, call } from 'redux-saga/effects';
import { apiGetChecklists } from '../../../utils/apiUrls';
import { request } from './../../../utils/request';
// import { checklists } from '../mockData';
import {
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
} from './action';
import { ListViewAction, ListViewActionType } from './types';

function* fetchChecklists(action: ListViewActionType) {
  try {
    yield put(fetchChecklistsOngoing());

    const params = action.payload;
    const response = yield call(request, 'GET', apiGetChecklists(), { params });

    yield put(fetchChecklistsSuccess(response));
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
