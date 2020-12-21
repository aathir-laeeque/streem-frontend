import { apiGetInbox } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Job } from '#views/Jobs/types';
import { call, put, takeLeading } from 'redux-saga/effects';

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
      apiGetInbox(),
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
  yield takeLeading(ListViewAction.FETCH_INBOX, fetchInboxSaga);
}
