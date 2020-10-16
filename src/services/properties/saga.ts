import { apiGetProperties } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLeading } from 'redux-saga/effects';

import { fetch, fetchError, fetchOngoing, fetchSuccess } from './actions';
import { PropertiesAction } from './types';

function* fetchSaga({ payload }: ReturnType<typeof fetch>) {
  try {
    const { entity } = payload;

    yield put(fetchOngoing());

    const { data, errors } = yield call(request, 'GET', apiGetProperties(), {
      params: { type: entity.toUpperCase() },
    });

    if (data) {
      yield put(fetchSuccess({ data, entity }));
    } else {
      yield put(fetchError(errors));
    }
  } catch (error) {
    console.error('error in fetchSaga  :: ', error);
  }
}

export function* PropertiesServiceSaga() {
  yield takeLeading(PropertiesAction.FETCH_PROPERTIES, fetchSaga);
}
