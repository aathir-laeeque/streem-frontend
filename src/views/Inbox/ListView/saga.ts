import { apiGetJobs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Job } from '../types';
import {
  fetchInbox,
  fetchInboxError,
  fetchInboxOngoing,
  fetchInboxSuccess,
} from './actions';
import { ListViewAction } from './types';

function* fetchInboxSaga({ payload }: ReturnType<typeof fetchInbox>) {
  try {
    const { params, type } = payload;

    if (params.page === 0) {
      yield put(fetchInboxOngoing());
    }

    const { data, pageable, errors }: ResponseObj<Job> = yield call(
      request,
      'GET',
      apiGetJobs(),
      { params },
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
    yield put(fetchInboxSuccess({ data, pageable }, type));
  } catch (error) {
    console.error(
      'error from fetchInboxSaga function in InboxListView Saga :: ',
      error,
    );
    yield put(fetchInboxError(error));
  }
}

export function* InboxListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_INBOX, fetchInboxSaga);
}
