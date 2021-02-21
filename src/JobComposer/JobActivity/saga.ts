import { apiGetJobActivity } from '#utils/apiUrls';
import { ResponseError, ResponseObj } from '#utils/globalTypes';
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
    const { jobId, params } = payload || {};
    let currentPage = params.page;
    if (currentPage === 0) {
      yield put(fetchJobActivitiesOngoing());
    } else {
      currentPage++;
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

    if (!pageable || errors) {
      throw getErrorMsg(errors as ResponseError[]);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchJobActivitiesSuccess({
        data: newData,
        pageable: {
          ...pageable,
          page: currentPage,
          last: newData.length > 0 ? false : true,
        },
      }),
    );
  } catch (error) {
    error = yield* handleCatch('JobActivity', 'fetchJobActivitiesSaga', error);
    yield put(fetchJobActivitiesError(error as string));
  }
}

export function* JobActivitySaga() {
  yield takeLeading(
    JobActivityAction.FETCH_JOB_ACTIVITY,
    fetchJobActivitiesSaga,
  );
}
