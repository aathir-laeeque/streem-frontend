import React from 'react';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { apiGetJobs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  createJob,
  createJobError,
  createJobSuccess,
  fetchJobs,
  fetchJobsError,
  fetchJobsOngoing,
  fetchJobsSuccess,
} from './actions';
import { Job, ListViewAction } from './types';
import { navigate } from '@reach/router';

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
    console.error('error from fetchJobsSaga function in JobListView Saga :: ', error);
    yield put(fetchJobsError(error));
  }
}

function* createJobSaga({ payload }: ReturnType<typeof createJob>) {
  try {
    const { errors, data }: ResponseObj<Job> = yield call(request, 'POST', apiGetJobs(), {
      data: {
        parameterValues: payload.parameterValues,
        selectedUseCaseId: payload.selectedUseCaseId,
        checklistId: payload.checklistId,
      },
    });
    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(closeOverlayAction(OverlayNames.CREATE_JOB_MODAL));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: (
          <div>
            <a className="clickable" onClick={() => navigate(`/inbox/${data.id}`)}>
              {data.code}
            </a>{' '}
            created successfully
          </div>
        ),
      }),
    );

    yield put(
      createJobSuccess({
        parameterValues: payload.parameterValues,
        selectedUseCaseId: payload.selectedUseCaseId,
        checklistId: payload.checklistId,
        id: data.id,
      }),
    );
  } catch (e) {
    yield put(createJobError());
    yield* handleCatch('JobListView', 'createJobSaga', e, true);
  }
}

export function* NewJobListViewSaga() {
  yield takeLatest(ListViewAction.CREATE_JOB, createJobSaga);
  yield takeLatest(ListViewAction.FETCH_JOBS, fetchJobsSaga);
}