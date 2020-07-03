import { apiGetJobs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';

import { showNotification } from '../../../components/Notification/actions';
import { NotificationType } from '../../../components/Notification/types';
import { Job } from '../types';
import {
  createJobError,
  createJobOngoing,
  createJobSuccess,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';
import { ListViewAction } from './types';

function* fetchJobs(action: any) {
  try {
    const params = action.payload.params;
    const type = action.payload.type;

    if (params.page === 0) {
      yield put(fetchJobsOngoing());
    }

    const { data, pageable }: ResponseObj<Job> = yield call(
      request,
      'GET',
      apiGetJobs(),
      { params },
    );
    yield put(fetchJobsSuccess({ data, pageable }, type));
  } catch (error) {
    console.error(
      'error from fetchJob function in JobListView Saga :: ',
      error,
    );
    yield put(fetchJobsError(error));
  }
}

function* createJob(action: any) {
  try {
    yield put(createJobOngoing());
    const payloadData = action.payload;
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'POST',
      apiGetJobs(),
      { data: payloadData },
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Job created successfully',
      }),
    );
    yield put(createJobSuccess({ data }));
  } catch (error) {
    console.error(
      'error from createJob function in JobListView Saga :: ',
      error.message,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error.message,
      }),
    );
    yield put(createJobError(error));
  }
}

export function* JobListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_JOBS, fetchJobs);
  yield takeLatest(ListViewAction.CREATE_JOB, createJob);
}
