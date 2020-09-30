import { apiGetChecklists } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLeading } from 'redux-saga/effects';

import { Checklist } from '../types';
import {
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
} from './actions';
import { ListViewAction } from './types';

function* fetchChecklists(action: any) {
  try {
    const params = action.payload;
    if (params.page === 0) {
      yield put(fetchChecklistsOngoing());
    }

    const { data, pageable }: ResponseObj<Checklist> = yield call(
      request,
      'GET',
      apiGetChecklists(),
      { params },
    );

    yield put(fetchChecklistsSuccess({ data, pageable }));
  } catch (error) {
    console.error(
      'error from fetchChecklist function in ChecklistListViewSaga :: ',
      error,
    );
    yield put(fetchChecklistsError(error));
  }
}

export function* ChecklistListViewSaga() {
  yield takeLeading(ListViewAction.FETCH_CHECKLISTS, fetchChecklists);
}
