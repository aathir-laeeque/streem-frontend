import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { RootState } from '#store';
import {
  apiApproveParameter,
  apiExecuteParameter,
  apiFixParameter,
  apiRejectParameter,
} from '#utils/apiUrls';
import { Error } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, select, takeLeading, takeLatest } from 'redux-saga/effects';
import { fetchData } from '../actions';
import { Entity } from '../composer.types';
import {
  approveRejectParameter,
  executeParameter,
  fixParameter,
  updateExecutedParameter,
} from './actions';
import { ParameterListAction } from './reducer.types';
import { SupervisorResponse } from './types';

function* executeParameterSaga({ payload }: ReturnType<typeof executeParameter>) {
  try {
    const { parameter, reason } = payload;

    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiExecuteParameter(), {
      data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
    });

    if (data) {
      if (
        data?.type === MandatoryParameter.SHOULD_BE &&
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
      yield put(updateExecutedParameter(data));
    } else {
      console.error('handle errors on execute Parameter Saga :: ', errors);
      const taskAlreadyCompletedError = (errors as Error[]).find((err) => err.code === 'E403');

      if (taskAlreadyCompletedError) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: taskAlreadyCompletedError.message,
              jobId,
              errorType: RefetchJobErrorType.PARAMETER,
            },
          }),
        );
      } else {
        yield* handleCatch('Parameter', 'executeParameterSaga', getErrorMsg(errors), true);
      }
    }
  } catch (error) {
    console.error('error came in the executeParameterSaga in ParameterListSaga :: ', error);
  }
}

function* fixParameterSaga({ payload }: ReturnType<typeof fixParameter>) {
  try {
    const { parameter, reason } = payload;

    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiFixParameter(), {
      data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
    });

    if (data) {
      yield put(updateExecutedParameter(data));
    } else {
      const taskAlreadyCompletedError = (errors as Error[]).find((err) => err.code === 'E403');

      if (taskAlreadyCompletedError) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: taskAlreadyCompletedError.message,
              jobId,
              errorType: RefetchJobErrorType.PARAMETER,
            },
          }),
        );
      } else {
        yield* handleCatch('Parameter', 'fixParameterSaga', getErrorMsg(errors), true);
      }
    }
  } catch (error) {
    console.error('error came in the fixParameterSaga in ParameterListSaga :: ', error);
  }
}

export function* approveRejectParameterSaga({
  payload,
}: ReturnType<typeof approveRejectParameter>) {
  try {
    const { parameterId, jobId, type } = payload;

    if (type === SupervisorResponse.APPROVE) {
      const { data, errors } = yield call(request, 'PATCH', apiApproveParameter(), {
        data: { parameterId, jobId },
      });

      if (data) {
        yield put(updateExecutedParameter(data));
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
      const { data, errors } = yield call(request, 'PATCH', apiRejectParameter(), {
        data: { parameterId, jobId },
      });

      if (data) {
        yield put(updateExecutedParameter(data));
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

export function* ParameterListSaga() {
  //TODO: Update execute parameter to takeLatest rather than takeLeading, also remove the need for server dependent data
  yield takeLatest(ParameterListAction.EXECUTE_PARAMETER_LATEST, executeParameterSaga);
  yield takeLatest(ParameterListAction.FIX_PARAMETER_LATEST, fixParameterSaga);
  yield takeLeading(ParameterListAction.EXECUTE_PARAMETER_LEADING, executeParameterSaga);
  yield takeLeading(ParameterListAction.FIX_PARAMETER_LEADING, fixParameterSaga);
  yield takeLeading(ParameterListAction.APPROVE_PARAMETER, approveRejectParameterSaga);
  yield takeLeading(ParameterListAction.REJECT_PARAMETER, approveRejectParameterSaga);
}
