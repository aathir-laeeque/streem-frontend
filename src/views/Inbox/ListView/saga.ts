import { apiGetInbox, apiParameterVerificationList } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { Job, Verification } from '#views/Jobs/ListView/types';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  fetchInbox,
  fetchInboxError,
  fetchInboxOngoing,
  fetchInboxSuccess,
  fetchVerifications,
  fetchVerificationsSuccess,
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

function* fetchVerificationsListSaga({ payload }: ReturnType<typeof fetchVerifications>) {
  try {
    const { data, pageable, errors }: ResponseObj<Verification[]> = yield call(
      request,
      'GET',
      apiParameterVerificationList(),
      payload,
    );
    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(fetchVerificationsSuccess({ data, pageable }));
  } catch (e) {
    yield* handleCatch('InboxListView', 'fetchVerificationsListSaga', e);
    yield put(fetchVerificationsSuccess());
  }
}

export function* InboxListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_INBOX, fetchInboxSaga);
  yield takeLatest(ListViewAction.FETCH_VERIFICATIONS, fetchVerificationsListSaga);
}
