import { apiGetSessionActivities } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, takeLeading } from 'redux-saga/effects';
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
    if (currentPage === 0) {
      yield put(fetchSessionActivitiesOngoing());
    } else {
      currentPage++;
    }

    const {
      data,
      pageable,
      errors,
    }: ResponseObj<SessionActivity[]> = yield call(
      request,
      'GET',
      apiGetSessionActivities(),
      { params },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchSessionActivitiesSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    const error = yield* handleCatch(
      'SessionActivity',
      'fetchSessionActivitiesSaga',
      e,
    );
    yield put(fetchSessionActivitiesError(error));
  }
}

export function* SessionActivitySaga() {
  yield takeLeading(
    SessionActivityAction.FETCH_SESSION_ACTIVITY,
    fetchSessionActivitiesSaga,
  );
}
