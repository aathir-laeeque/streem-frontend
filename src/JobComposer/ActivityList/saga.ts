import { setActiveStage } from '#JobComposer/StageList/actions';
import { setActiveTask } from '#JobComposer/TaskList/actions';
import { ParameterExecutionState } from '#JobComposer/checklist.types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import {
  apiAcceptVerification,
  apiApproveParameter,
  apiExecuteParameter,
  apiFixParameter,
  apiInitiatePeerVerification,
  apiInitiateSelfVerification,
  apiRecallVerification,
  apiRejectParameter,
  apiRejectPeerVerification,
  apiValidatePassword,
} from '#utils/apiUrls';
import { Error } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import { updateHiddenIds } from '../actions';
import {
  acceptPeerVerification,
  approveRejectParameter,
  completeSelfVerification,
  executeParameter,
  fixParameter,
  initiateSelfVerification,
  recallPeerVerification,
  rejectPeerVerification,
  sendPeerVerification,
  updateExecutedParameter,
  updateParameterVerificationSuccess,
} from './actions';
import { ParameterListAction } from './reducer.types';
import { SupervisorResponse } from './types';
import { LoginErrorCodes } from '#utils/constants';
import { navigate } from '@reach/router';

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
        data?.response?.state === ParameterExecutionState.PENDING_FOR_APPROVAL
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
      }
      yield put(updateExecutedParameter(data));
      yield put(updateHiddenIds());
    } else {
      yield put(updateExecutedParameter(parameter));
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

    const {
      entityId: jobId,
      stages: { activeStageId },
      tasks: { activeTaskId, tasksOrderList },
    } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiFixParameter(), {
      data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
    });

    if (data) {
      yield put(updateExecutedParameter(data));
    } else {
      yield put(updateExecutedParameter(parameter));
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
        const taskNotEnabledForErrorCorrection = (errors as Error[]).find(
          (err) => err.code === 'E214',
        );

        if (taskNotEnabledForErrorCorrection) {
          if (activeTaskId !== errors[0]?.id) {
            const expectedTaskIndex = tasksOrderList.findIndex((o) => o.taskId === errors[0]?.id);
            const expectedStageId = tasksOrderList[expectedTaskIndex].stageId;

            if (expectedStageId !== activeStageId) {
              yield put(setActiveStage(expectedStageId, true));
              yield put(setActiveTask(errors[0]?.id, true));
            } else {
              yield put(setActiveTask(errors[0]?.id, true));
            }
          }
        }

        throw getErrorMsg(errors);
      }
    }
  } catch (error) {
    yield handleCatch('Parameter', 'fixParameterSaga', error, true);
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

function* initiateSelfVerificationSaga({ payload }: ReturnType<typeof initiateSelfVerification>) {
  try {
    const { parameterId } = payload;
    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(
      request,
      'POST',
      apiInitiateSelfVerification({ parameterId, jobId }),
    );

    if (data) {
      yield put(updateParameterVerificationSuccess(parameterId, data));
    } else {
      yield handleCatch('Job', 'initiateSelfVerification', getErrorMsg(errors), true);
    }
  } catch (error) {
    yield handleCatch('Job', 'initiateSelfVerification', error);
  }
}

function* completeSelfVerificationSaga({ payload }: ReturnType<typeof completeSelfVerification>) {
  try {
    const { parameterId, password, code, state } = payload;

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'PATCH',
      apiValidatePassword(),
      { data: { password: password ? encrypt(password) : null, code, state } },
    );

    if (validateData) {
      const { entityId: jobId } = yield select((state: RootState) => state.composer);

      const { data, errors } = yield call(
        request,
        'PATCH',
        apiAcceptVerification({ parameterId, jobId, type: 'self' }),
      );

      if (data) {
        yield put(updateParameterVerificationSuccess(parameterId, data));
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Parameter has been Self Verified Successfully',
          }),
        );
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      throw getErrorMsg(validateErrors);
    }
  } catch (error) {
    console.error('error came in the completeSelfVerification in ParameterListSaga :: ', error);
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
      }),
    );
  }
}

function* sendPeerVerificationSaga({ payload }: ReturnType<typeof sendPeerVerification>) {
  try {
    const { parameterId, userId } = payload;

    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(
      request,
      'POST',
      apiInitiatePeerVerification({ parameterId, jobId }),
      {
        data: {
          userId,
        },
      },
    );

    if (data) {
      yield put(updateParameterVerificationSuccess(parameterId, data));
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Request for Parameter Verification Sent Successfully',
        }),
      );
    } else {
      yield handleCatch('Job', 'sendPeerVerificationSaga', getErrorMsg(errors), true);
    }
  } catch (error) {
    yield handleCatch('Job', 'sendPeerVerificationSaga', error);
  }
}

function* recallPeerVerificationSaga({ payload }: ReturnType<typeof recallPeerVerification>) {
  try {
    const { parameterId, type } = payload;

    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiRecallVerification({ parameterId, jobId, type }),
    );

    if (data) {
      yield put(updateParameterVerificationSuccess(parameterId, data));
    } else {
      yield handleCatch('Job', 'recallPeerVerificationSaga', getErrorMsg(errors), true);
    }
  } catch (error) {
    yield handleCatch('Job', 'recallPeerVerificationSaga', error);
  }
}

function* acceptPeerVerificationSaga({ payload }: ReturnType<typeof acceptPeerVerification>) {
  try {
    const { parameterId, password, code, state } = payload;

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'PATCH',
      apiValidatePassword(),
      { data: { password: password ? encrypt(password) : null, code, state } },
    );

    if (validateData) {
      const { entityId: jobId } = yield select((state: RootState) => state.composer);

      const { data, errors } = yield call(
        request,
        'PATCH',
        apiAcceptVerification({ parameterId, jobId, type: 'peer' }),
      );

      if (data) {
        yield put(updateParameterVerificationSuccess(parameterId, data));
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      throw getErrorMsg(validateErrors);
    }
  } catch (error) {
    yield handleCatch('Job', 'acceptPeerVerificationSaga', error, true);
  }
}

function* rejectPeerVerificationSaga({ payload }: ReturnType<typeof rejectPeerVerification>) {
  try {
    const { parameterId, comment } = payload;

    const { entityId: jobId } = yield select((state: RootState) => state.composer);

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiRejectPeerVerification({ parameterId, jobId }),
      {
        data: {
          comments: comment,
        },
      },
    );

    yield put(closeOverlayAction(OverlayNames.REASON_MODAL));

    if (data) {
      yield put(updateParameterVerificationSuccess(parameterId, data));
    } else {
      yield handleCatch('Job', 'rejectPeerVerificationSaga', getErrorMsg(errors), true);
    }
  } catch (error) {
    yield handleCatch('Job', 'rejectPeerVerificationSaga', error);
  }
}

export function* ParameterListSaga() {
  yield takeLatest(ParameterListAction.EXECUTE_PARAMETER_LATEST, executeParameterSaga);
  yield takeLatest(ParameterListAction.FIX_PARAMETER_LATEST, fixParameterSaga);
  yield takeLeading(ParameterListAction.EXECUTE_PARAMETER_LEADING, executeParameterSaga);
  yield takeLeading(ParameterListAction.FIX_PARAMETER_LEADING, fixParameterSaga);
  yield takeLeading(ParameterListAction.APPROVE_PARAMETER, approveRejectParameterSaga);
  yield takeLeading(ParameterListAction.REJECT_PARAMETER, approveRejectParameterSaga);
  yield takeLeading(ParameterListAction.INITIATE_SELF_VERIFICATION, initiateSelfVerificationSaga);
  yield takeLeading(ParameterListAction.COMPLETE_SELF_VERIFICATION, completeSelfVerificationSaga);
  yield takeLeading(ParameterListAction.SEND_PEER_VERIFICATION, sendPeerVerificationSaga);
  yield takeLeading(ParameterListAction.RECALL_PEER_VERIFICATION, recallPeerVerificationSaga);
  yield takeLeading(ParameterListAction.ACCEPT_PEER_VERIFICATION, acceptPeerVerificationSaga);
  yield takeLeading(ParameterListAction.REJECT_PEER_VERIFICATION, rejectPeerVerificationSaga);
}
