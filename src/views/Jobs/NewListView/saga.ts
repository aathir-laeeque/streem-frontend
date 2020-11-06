import { apiGetJobs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Job } from '#views/Jobs/types';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';
import { ListViewAction } from './types';

function* fetchJobsSaga({ payload }: ReturnType<typeof fetchJobs>) {
  try {
    const { params } = payload;

    yield put(fetchJobsOngoing());

    const { data, pageable, errors }: ResponseObj<Job> = yield call(
      request,
      'GET',
      apiGetJobs(),
      { params },
    );

    if (data) {
      yield put(fetchJobsSuccess({ data, pageable }));
    }
  } catch (error) {
    console.error(
      'error from fetchJobsSaga function in JobListView Saga :: ',
      error,
    );
    yield put(fetchJobsError(error));
  }
}

export function* NewJobListViewSaga() {
  yield takeLeading(ListViewAction.FETCH_JOBS, fetchJobsSaga);
}
