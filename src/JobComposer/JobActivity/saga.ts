import { apiGetJobActivity } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import moment from 'moment';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchJobActivities,
  fetchJobActivitiesError,
  fetchJobActivitiesOngoing,
  fetchJobActivitiesSuccess,
} from './actions';
import { JobActivity, JobActivityAction } from './types';

function* fetchJobActivitiesSaga({
  payload,
}: ReturnType<typeof fetchJobActivities>) {
  try {
    const { jobId, params } = payload;

    if (params.page === 0) {
      yield put(fetchJobActivitiesOngoing());
    }

    const {
      data,
      pageable,
      errors,
    }: ResponseObj<JobActivity[]> = yield call(
      request,
      'GET',
      apiGetJobActivity(jobId),
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
      fetchJobActivitiesSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    const error = yield* handleCatch(
      'JobActivity',
      'fetchJobActivitiesSaga',
      e,
    );
    yield put(fetchJobActivitiesError(error));
  }
}

export function* JobActivitySaga() {
  yield takeLeading(
    JobActivityAction.FETCH_JOB_ACTIVITY,
    fetchJobActivitiesSaga,
  );
}
