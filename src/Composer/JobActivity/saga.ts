import { apiGetJobActivity } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLeading } from 'redux-saga/effects';
import moment from 'moment';
import { JobActivity } from './types';
import {
  fetchJobActivitiesError,
  fetchJobActivitiesOngoing,
  fetchJobActivitiesSuccess,
  fetchJobActivities,
} from './actions';
import { JobActivityAction } from './types';

function* fetchJobActivitiesSaga({
  payload,
}: ReturnType<typeof fetchJobActivities>) {
  try {
    const { jobId, params } = payload || {};
    let currentPage = parseInt(params.page.toString());
    if (currentPage === 0) {
      yield put(fetchJobActivitiesOngoing());
    } else {
      currentPage++;
    }

    const {
      data,
      pageable,
      errors,
    }: ResponseObj<JobActivity> = yield call(
      request,
      'GET',
      apiGetJobActivity(jobId),
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
    console.error(
      'error from fetchJobActivitiesSaga function in JobActivitySaga :: ',
      error,
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
