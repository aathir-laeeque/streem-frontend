import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { RootState } from '#store';
import { apiAssignUser, apiGetJobs, apiUnAssignUser } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Job } from '../types';
import {
  assignUser,
  createJob,
  createJobError,
  createJobOngoing,
  createJobSuccess,
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
  unAssignUser,
} from './actions';
import { ListViewAction } from './types';

function* fetchJobsSaga({ payload }: ReturnType<typeof fetchJobs>) {
  try {
    const { params, type } = payload;

    if (params.page === 0) {
      yield put(fetchJobsOngoing());
    }

    const { data, pageable, errors }: ResponseObj<Job> = yield call(
      request,
      'GET',
      apiGetJobs(),
      { params },
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
    yield put(fetchJobsSuccess({ data, pageable }, type));
  } catch (error) {
    console.error(
      'error from fetchJobsSaga function in JobListView Saga :: ',
      error,
    );
    yield put(fetchJobsError(error));
  }
}

function* createJobSaga({ payload }: ReturnType<typeof createJob>) {
  try {
    yield put(createJobOngoing());
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'POST',
      apiGetJobs(),
      { data: payload },
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
      'error from createJobSaga function in JobListView Saga :: ',
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

function* assignUserSaga({ payload }: ReturnType<typeof assignUser>) {
  try {
    const { selectedStatus } = yield select(
      (state: RootState) => state?.jobListView,
    );

    const { id } = yield select(
      (state: RootState) =>
        state?.jobListView.jobs[selectedStatus].list[payload.selectedJobIndex],
    );
    const user = payload.user;
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'POST',
      apiAssignUser(id, user.id),
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
  } catch (error) {
    console.error(
      'error from assignUserSaga function in JobListView Saga :: ',
      error.message,
    );
  }
}

function* unAssignUserSaga({ payload }: ReturnType<typeof unAssignUser>) {
  try {
    const { selectedStatus } = yield select(
      (state: RootState) => state?.jobListView,
    );

    const { id } = yield select(
      (state: RootState) =>
        state?.jobListView.jobs[selectedStatus].list[payload.selectedJobIndex],
    );
    const user = payload.user;
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'DELETE',
      apiUnAssignUser(id, user.id),
    );
    if (errors) {
      throw new Error(errors[0].message);
    }
  } catch (error) {
    console.error(
      'error from assignUserSaga function in JobListView Saga :: ',
      error.message,
    );
  }
}

export function* JobListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_JOBS, fetchJobsSaga);
  yield takeLatest(ListViewAction.CREATE_JOB, createJobSaga);
  yield takeLatest(ListViewAction.ASSIGN_USER, assignUserSaga);
  yield takeLatest(ListViewAction.UNASSIGN_USER, unAssignUserSaga);
}
