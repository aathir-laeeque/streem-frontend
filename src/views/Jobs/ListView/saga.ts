import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { RootState } from '#store';
import { apiAssignUser, apiGetJobs, apiUnAssignUser } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';

import { Job } from '#views/Jobs/types';
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
import { fetchJobs as fetchJobsNew } from '../NewListView/actions';

function* fetchJobsSaga({ payload }: ReturnType<typeof fetchJobs>) {
  try {
    const { params, type } = payload;

    if (params.page === 0) {
      yield put(fetchJobsOngoing());
    }

    const { data, pageable, errors }: ResponseObj<Job[]> = yield call(
      request,
      'GET',
      apiGetJobs(),
      { params },
    );
    if (errors) {
      throw getErrorMsg(errors);
    }
    yield put(fetchJobsSuccess({ data, pageable }, type));
  } catch (e) {
    const error = yield* handleCatch('JobListView', 'fetchJobsSaga', e);
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
      throw getErrorMsg(errors);
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Job created successfully',
      }),
    );
    yield put(createJobSuccess({ data }));
    yield put(
      fetchJobsNew({
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        filters: JSON.stringify({
          op: 'AND',
          fields: [
            {
              field: 'state',
              op: 'EQ',
              values: ['UNASSIGNED'],
            },
          ],
        }),
      }),
    );
  } catch (e) {
    const error = yield* handleCatch('JobListView', 'createJobSaga', e, true);
    yield put(createJobError(error));
  }
}

function* assignUserSaga({ payload }: ReturnType<typeof assignUser>) {
  try {
    const { selectedState } = yield select(
      (state: RootState) => state?.jobListView,
    );

    const { id } = yield select(
      (state: RootState) =>
        state?.jobListView.jobs[selectedState].list[payload.selectedJobIndex],
    );
    const user = payload.user;
    const { errors }: ResponseObj<Job> = yield call(
      request,
      'POST',
      apiAssignUser(id, user.id),
    );
    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield* handleCatch('JobListView', 'assignUserSaga', error);
  }
}

function* unAssignUserSaga({ payload }: ReturnType<typeof unAssignUser>) {
  try {
    const { selectedState } = yield select(
      (state: RootState) => state?.jobListView,
    );

    const { id } = yield select(
      (state: RootState) =>
        state?.jobListView.jobs[selectedState].list[payload.selectedJobIndex],
    );
    const user = payload.user;
    const { data, errors }: ResponseObj<Job> = yield call(
      request,
      'DELETE',
      apiUnAssignUser(id, user.id),
    );
    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield* handleCatch('JobListView', 'unAssignUserSaga', error);
  }
}

export function* JobListViewSaga() {
  yield takeLeading(ListViewAction.FETCH_JOBS, fetchJobsSaga);
  yield takeLatest(ListViewAction.CREATE_JOB, createJobSaga);
  yield takeLatest(ListViewAction.ASSIGN_USER, assignUserSaga);
  yield takeLatest(ListViewAction.UNASSIGN_USER, unAssignUserSaga);
}
