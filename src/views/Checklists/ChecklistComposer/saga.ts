import { apiGetChecklist } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  fetchChecklist,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
} from './actions';
import { StageListSaga } from './StageList/saga';
import { TaskListSaga } from './TaskList/saga';
import { ComposerAction } from './types';

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
    console.error('error from fetchChecklist saga :: ', error);
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_CHECKLIST, fetchChecklistSaga);

  yield all([fork(StageListSaga), fork(TaskListSaga)]);
}
