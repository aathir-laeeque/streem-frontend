import {
  apiArchiveChecklist,
  apiGetChecklists,
  apiUnarchiveChecklist,
} from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';

import { Checklist } from '../types';
import {
  archiveChecklist,
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
  unarchiveChecklist,
} from './actions';
import { ListViewAction } from './types';
import { updateList, fetchChecklists } from './actions';

function* fetchChecklistsSaga({ payload }: ReturnType<typeof fetchChecklists>) {
  try {
    const { params, dispatchOngoing } = payload;
    if (params.page === 0 && dispatchOngoing) {
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

function* archiveChecklistSaga({
  payload,
}: ReturnType<typeof archiveChecklist>) {
  try {
    const { id } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiArchiveChecklist(id),
    );

    if (data) {
      yield put(updateList(id));
    } else {
      console.error('error from apiArchiveChecklist :: ', errors);
    }
  } catch (error) {
    console.error('error in archiveChecklist saga :: ', error);
  }
}

function* unarchiveChecklistSaga({
  payload,
}: ReturnType<typeof unarchiveChecklist>) {
  try {
    const { id } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiUnarchiveChecklist(id),
    );

    if (data) {
      yield put(updateList(id));
    } else {
      console.error('error from apiArchiveChecklist :: ', errors);
    }
  } catch (error) {
    console.error('error in archiveChecklist saga :: ', error);
  }
}

export function* ChecklistListViewSaga() {
  yield takeLeading(ListViewAction.FETCH_CHECKLISTS, fetchChecklistsSaga);
  yield takeLatest(ListViewAction.ARCHIVE, archiveChecklistSaga);
  yield takeLatest(ListViewAction.UNARCHIVE, unarchiveChecklistSaga);
}
