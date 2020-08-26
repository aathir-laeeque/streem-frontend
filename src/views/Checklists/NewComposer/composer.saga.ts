import { apiGetChecklist, apiGetSelectedJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  fetchComposerData,
  fetchComposerDataError,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  // fetchSelectedJob,
} from './composer.action';
import { ComposerAction } from './composer.types';
import { TaskListViewSaga } from './TaskListView/saga';

function* fetchComposerDataSaga({
  payload,
}: ReturnType<typeof fetchComposerData>) {
  try {
    yield put(fetchComposerDataOngoing());

    const { data } = yield call(
      request,
      'GET',
      payload.type === 'checklist'
        ? apiGetChecklist(payload.id)
        : apiGetSelectedJob(payload.id),
    );

    if (payload.type === 'checklist') {
      yield put(fetchComposerDataSuccess(data));
    } else {
      yield put(fetchComposerDataSuccess(data?.checklist));
    }
  } catch (error) {
    console.log('Error from fetchComposerDataSaga :: ', error);

    yield put(fetchComposerDataError(error));
  }
}

export function* NewComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchComposerDataSaga);

  yield all([
    // FORK ALL COMPOSER RELATED SAGA HERE
    fork(TaskListViewSaga),
  ]);
}
