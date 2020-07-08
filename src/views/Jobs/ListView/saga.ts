import { apiGetJobs, apiAssignUser } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { RootState } from '#store';
import { call, put, select, takeLatest } from 'redux-saga/effects';

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
  assignUserError,
  unAssignUserError,
} from './actions';
import { ListViewAction, ListViewActionType } from './types';

function* fetchJobs(action: ListViewActionType) {
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

function* createJob(action: ListViewActionType) {
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

function* assignUserSaga(action: ListViewActionType) {
  try {
    const { selectedStatus } = yield select(
      (state: RootState) => state?.jobListView,
    );

    const { id } = yield select(
      (state: RootState) =>
        state?.jobListView.jobs[selectedStatus].list[
          action.payload?.selectedJobIndex
        ],
    );
    const user = action.payload.user;
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'PUT',
      apiAssignUser(id),
      { data: user },
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
    console.log('data', data);
    console.log('errors', errors);
    console.log('action', action);
  } catch (error) {
    console.error(
      'error from createJob function in JobListView Saga :: ',
      error.message,
    );
  }
}

export function* JobListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_JOBS, fetchJobs);
  yield takeLatest(ListViewAction.CREATE_JOB, createJob);
  yield takeLatest(ListViewAction.ASSIGN_USER, assignUserSaga);
  // yield takeLatest(ListViewAction.UNASSIGN_USER, unAssignUser);
}
