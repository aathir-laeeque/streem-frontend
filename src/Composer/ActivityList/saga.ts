import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { MandatoryActivity } from '#Composer-new/checklist.types';
import { RootState } from '#store';
import {
  apiExecuteActivity,
  apiFixActivity,
  apiApproveActivity,
  apiRejectActivity,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  approveRejectActivity,
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from './actions';
import { ActivityListAction } from './reducer.types';
import { SupervisorResponse } from './types';
import { fetchData } from '../actions';
import { Entity } from '../composer.types';

function* executeActivitySaga({ payload }: ReturnType<typeof executeActivity>) {
  try {
    console.log('payload from executeActivitySaga :: ', payload);

    const { activity, reason } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data } = yield call(request, 'PUT', apiExecuteActivity(), {
      data: { jobId, activity, ...(!!reason ? { reason } : {}) },
    });

    if (data) {
      if (
        data?.type === MandatoryActivity.PARAMETER &&
        data?.response?.status === 'PENDING_FOR_APPROVAL'
      ) {
        yield put(
          openOverlayAction({
            type: OverlayNames.PARAMETER_APPROVAL,
            props: {
              observationSent: true,
              observationApproved: false,
              observationRejected: false,
            },
          }),
        );
        yield put(fetchData({ id: jobId, entity: Entity.JOB }));
      }
      yield put(updateExecutedActivity(data));
    }
  } catch (error) {
    console.error(
      'error came in the executeActivitySaga in ActivityListSaga :: ',
      error,
    );
  }
}

function* fixActivitySaga({ payload }: ReturnType<typeof fixActivity>) {
  try {
    console.log('payload from fixActivitySaga :: ', payload);

    const { activity } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data } = yield call(request, 'PUT', apiFixActivity(), {
      data: { jobId, activity },
    });

    if (data) {
      yield put(updateExecutedActivity(data));
    }
  } catch (error) {
    console.error(
      'error came in the executeActivitySaga in ActivityListSaga :: ',
      error,
    );
  }
}

export function* handleActivityErrorSaga(payload) {
  console.log('came to handleActivityErrorSaga with payload ::: ', payload);
}

export function* approveRejectActivitySaga({
  payload,
}: ReturnType<typeof approveRejectActivity>) {
  try {
    const { activityId, jobId, type } = payload;

    if (type === SupervisorResponse.APPROVE) {
      const { data, errors } = yield call(
        request,
        'PATCH',
        apiApproveActivity(),
        { data: { activityId, jobId } },
      );

      if (data) {
        yield put(updateExecutedActivity(data));
        yield put(
          openOverlayAction({
            type: OverlayNames.PARAMETER_APPROVAL,
            props: {
              observationSent: false,
              observationApproved: true,
              observationRejected: false,
            },
          }),
        );
      } else {
        console.log('error from approval api :: ', errors);
      }
    } else {
      const { data, errors } = yield call(
        request,
        'PATCH',
        apiRejectActivity(),
        { data: { activityId, jobId } },
      );

      if (data) {
        yield put(updateExecutedActivity(data));
        yield put(
          openOverlayAction({
            type: OverlayNames.PARAMETER_APPROVAL,
            props: {
              observationSent: false,
              observationApproved: false,
              observationRejected: true,
            },
          }),
        );
      } else {
        console.log('error from reject api :: ', errors);
      }
    }
  } catch (error) {}
}

export function* ActivityListSaga() {
  yield takeLatest(ActivityListAction.EXECUTE_ACTIVITY, executeActivitySaga);
  yield takeLatest(ActivityListAction.FIX_ACTIVITY, fixActivitySaga);
  yield takeLatest(
    ActivityListAction.APPROVE_ACTIVITY,
    approveRejectActivitySaga,
  );
  yield takeLatest(
    ActivityListAction.REJECT_ACTIVITY,
    approveRejectActivitySaga,
  );
}
