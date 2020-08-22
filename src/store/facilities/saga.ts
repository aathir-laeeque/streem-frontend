import { apiGetFacilities } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { put, call, takeEvery } from 'redux-saga/effects';
import {
  fetchFacilitiesError,
  fetchFacilitiesSuccess,
  fetchFacilitiesOngoing,
} from './actions';
import { FacilitiesAction, Facilities } from './types';

function* fetchFacilitiesSaga() {
  try {
    yield put(fetchFacilitiesOngoing());
    const { data }: ResponseObj<Facilities> = yield call(
      request,
      'GET',
      apiGetFacilities(),
    );
    yield put(fetchFacilitiesSuccess(data));
  } catch (error) {
    console.error(
      'error from fetchFacilitiesSaga function in FacilitiesSaga :: ',
      error,
    );
    yield put(fetchFacilitiesError(error));
  }
}

export function* FacilitiesSaga() {
  yield takeEvery(FacilitiesAction.FETCH_FACILITIES, fetchFacilitiesSaga);
}
