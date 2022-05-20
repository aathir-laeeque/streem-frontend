import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { MandatoryActivity } from '#PrototypeComposer/checklist.types';
import { RootState } from '#store';
import {
  apiApproveActivity,
  apiExecuteActivity,
  apiFixActivity,
  apiRejectActivity,
} from '#utils/apiUrls';
import { Error } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, select, takeLeading, takeLatest } from 'redux-saga/effects';
import { fetchData } from '../actions';
import { Entity } from '../composer.types';
import {
  approveRejectActivity,
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from './actions';
import { ActivityListAction } from './reducer.types';
import { SupervisorResponse } from './types';

function* executeActivitySaga({ payload }: ReturnType<typeof executeActivity>) {
  try {
    console.log('payload from executeActivitySaga :: ', payload);

    const { activity, reason } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiExecuteActivity(),
      {
        data: { jobId, activity, ...(!!reason ? { reason } : {}) },
      },
    );

    if (data) {
      if (
        data?.type === MandatoryActivity.PARAMETER &&
        data?.response?.state === 'PENDING_FOR_APPROVAL'
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
    } else {
      console.error('handle errors on execute Activity Saga :: ', errors);
      const taskAlreadyCompletedError = (errors as Error[]).find(
        (err) => err.code === 'E403',
      );

      if (taskAlreadyCompletedError) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: taskAlreadyCompletedError.message,
              jobId,
              errorType: RefetchJobErrorType.ACTIVITY,
            },
          }),
        );
      }
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

    const { activity, reason } = payload;

    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data, errors } = yield call(request, 'PATCH', apiFixActivity(), {
      data: { jobId, activity, ...(!!reason ? { reason } : {}) },
    });

    if (data) {
      yield put(updateExecutedActivity(data));
    } else {
      const taskAlreadyCompletedError = (errors as Error[]).find(
        (err) => err.code === 'E403',
      );

      if (taskAlreadyCompletedError) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: taskAlreadyCompletedError.message,
              jobId,
              errorType: RefetchJobErrorType.ACTIVITY,
            },
          }),
        );
      }
    }
  } catch (error) {
    console.error(
      'error came in the executeActivitySaga in ActivityListSaga :: ',
      error,
    );
  }
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
  //TODO: Update execute activity to takeLatest rather than takeLeading, also remove the need for server dependent data
  yield takeLatest(
    ActivityListAction.EXECUTE_ACTIVITY_LATEST,
    executeActivitySaga,
  );
  yield takeLatest(ActivityListAction.FIX_ACTIVITY_LATEST, fixActivitySaga);
  yield takeLeading(
    ActivityListAction.EXECUTE_ACTIVITY_LEADING,
    executeActivitySaga,
  );
  yield takeLeading(ActivityListAction.FIX_ACTIVITY_LEADING, fixActivitySaga);
  yield takeLeading(
    ActivityListAction.APPROVE_ACTIVITY,
    approveRejectActivitySaga,
  );
  yield takeLeading(
    ActivityListAction.REJECT_ACTIVITY,
    approveRejectActivitySaga,
  );
}
