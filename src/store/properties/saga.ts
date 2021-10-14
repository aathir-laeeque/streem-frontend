import { apiGetProperties } from '#utils/apiUrls';
import { request } from '#utils/request';
import { put, call, takeEvery } from 'redux-saga/effects';
import {
  fetchPropertiesError,
  fetchPropertiesSuccess,
  fetchProperties,
} from './actions';
import { PropertiesAction } from './types';

function* fetchPropertiesSaga({ payload }: ReturnType<typeof fetchProperties>) {
  try {
    const { type } = payload;
    const { data, errors } = yield call(request, 'GET', apiGetProperties(), {
      params: { type: type.toUpperCase() },
    });

    if (data) {
      yield put(fetchPropertiesSuccess({ data, type }));
    } else {
      yield put(fetchPropertiesError(errors));
    }
  } catch (error) {
    console.error(
      'error from fetchProperties function in PropertiesPropertiesSaga :: ',
      error,
    );
    yield put(fetchPropertiesError(error));
  }
}

export function* PropertiesSaga() {
  yield takeEvery(PropertiesAction.FETCH_PROPERTIES, fetchPropertiesSaga);
}
