import { apiGetSessionActivities } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import { SessionActivity } from './types';
import {
  fetchSessionActivitiesError,
  fetchSessionActivitiesOngoing,
  fetchSessionActivitiesSuccess,
  fetchSessionActivities,
} from './actions';
import { SessionActivityAction } from './types';

function* fetchSessionActivitiesSaga({
  payload,
}: ReturnType<typeof fetchSessionActivities>) {
  try {
    const params = payload || {};
    let currentPage = parseInt(params.page.toString());
    delete params.page;
    if (currentPage === 0) {
      yield put(fetchSessionActivitiesOngoing());
    } else {
      currentPage++;
    }

    const {
      data,
      pageable,
      errors,
    }: ResponseObj<SessionActivity> = yield call(
      request,
      'GET',
      apiGetSessionActivities(),
      { params },
    );

    if (errors || !pageable) {
      throw new Error(errors[0].message);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchSessionActivitiesSuccess({
        data: newData,
        pageable: {
          ...pageable,
          page: currentPage,
          last: newData.length > 0 ? false : true,
        },
      }),
    );
  } catch (error) {
    console.error(
      'error from fetchSessionActivitiesSaga function in SessionActivitySaga :: ',
      error,
    );
    yield put(fetchSessionActivitiesError(error));
  }
}

export function* SessionActivitySaga() {
  yield takeLatest(
    SessionActivityAction.FETCH_SESSION_ACTIVITY,
    fetchSessionActivitiesSaga,
  );
}
