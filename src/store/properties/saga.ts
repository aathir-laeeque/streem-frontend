import { apiGetProperties } from '#utils/apiUrls';
import { request } from '#utils/request';
import { put, call, takeEvery } from 'redux-saga/effects';
import { fetchPropertiesError, fetchPropertiesSuccess } from './actions';
import { PropertiesAction } from './types';

// TODO Update like others

function* fetchProperties(action: any) {
  try {
    const params = action.payload;
    const response = yield call(request, 'GET', apiGetProperties(), { params });
    yield put(fetchPropertiesSuccess(response.data, params.type));
  } catch (error) {
    console.error(
      'error from fetchProperties function in PropertiesPropertiesSaga :: ',
      error,
    );
    yield put(fetchPropertiesError(error));
  }
}

export function* PropertiesSaga() {
  yield takeEvery(PropertiesAction.FETCH_PROPERTIES, fetchProperties);
}
