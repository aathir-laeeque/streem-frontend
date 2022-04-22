import { apiGetInbox } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { Job } from '#views/Jobs/NewListView/types';
import { call, put, takeLatest } from 'redux-saga/effects';

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

    const { data, pageable, errors }: ResponseObj<Job[]> = yield call(
      request,
      'GET',
      apiGetInbox(),
      {
        params,
      },
    );
    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(fetchInboxSuccess({ data, pageable }, type));
  } catch (e) {
    const error = yield* handleCatch('InboxListView', 'fetchInboxSaga', e);
    yield put(fetchInboxError(error));
  }
}

export function* InboxListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_INBOX, fetchInboxSaga);
}
