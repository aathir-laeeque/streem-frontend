import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { RootState } from '#store';
import { apiGetJobs } from '#utils/apiUrls';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';

import {
  createJob,
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';
import { Job, ListViewAction } from './types';

function* fetchJobsSaga({ payload }: ReturnType<typeof fetchJobs>) {
  try {
    const { params } = payload;

    yield put(fetchJobsOngoing());

    const { data, pageable } = yield call(request, 'GET', apiGetJobs(), {
      params,
    });

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

function* createJobSaga({ payload }: ReturnType<typeof createJob>) {
  try {
    const facilityId: string = yield select(
      (state: RootState) => state.auth.selectedFacility?.id,
    );

    const { errors }: ResponseObj<Job> = yield call(
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

    yield put(
      fetchJobs({
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        filters: JSON.stringify({
          op: FilterOperators.AND,
          fields: [
            {
              field: 'state',
              op: FilterOperators.EQ,
              values: ['UNASSIGNED'],
            },
            {
              field: 'useCaseId',
              op: FilterOperators.EQ,
              values: [payload.selectedUseCaseId],
            },
          ],
        }),
      }),
    );
  } catch (e) {
    yield* handleCatch('JobListView', 'createJobSaga', e, true);
  }
}

export function* NewJobListViewSaga() {
  yield takeLatest(ListViewAction.CREATE_JOB, createJobSaga);
  yield takeLeading(ListViewAction.FETCH_JOBS, fetchJobsSaga);
}
