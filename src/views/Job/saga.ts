import { ParameterErrors, SupervisorResponse } from '#JobComposer/ActivityList/types';
import { TaskAction, TaskErrors } from '#JobComposer/TaskList/types';
import { getAutomationActionTexts } from '#JobComposer/TaskList/utils';
import {
  AutomationAction,
  AutomationActionActionType,
  MandatoryParameter,
} from '#JobComposer/checklist.types';
import { JobWithExceptionInCompleteTaskErrors } from '#JobComposer/composer.types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
import { Users } from '#store/users/types';
import { Parameter, REFETCH_JOB_ERROR_CODES, StoreTask, TaskExecution } from '#types';
import {
  apiAcceptVerification,
  apiApproveParameter,
  apiCompleteJob,
  apiExecuteParameter,
  apiGetAllUsersAssignedToJob,
  apiGetSelectedJob,
  apiInitiatePeerVerification,
  apiInitiateSelfVerification,
  apiPauseJob,
  apiPerformActionOnTask,
  apiRecallVerification,
  apiRejectParameter,
  apiRejectPeerVerification,
  apiResumeJob,
  apiStartJob,
  apiValidatePassword,
} from '#utils/apiUrls';
import { ResponseError, ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { Job, Verification } from '#views/Jobs/ListView/types';
import { navigate } from '@reach/router';
import { all, call, put, select, takeLatest, takeLeading, fork } from 'redux-saga/effects';
import { JobActionsEnum, jobActions } from './jobStore';
import { parseJobData } from './utils';
import { StagePollingSaga } from './stagePollingSaga';

const getUserId = (state: RootState) => state.auth.userId;

// TODO: remove this and make respective changes in the Parameters
function getParametersDataByTaskId(task: StoreTask, parameters: RootState['job']['parameters']) {
  const { parameters: parameterIds } = task;
  return parameterIds.map((id) => {
    const parameter = parameters.get(id);
    if (parameter)
      switch (parameter.type) {
        case MandatoryParameter.SIGNATURE:
        case MandatoryParameter.MEDIA:
          return {
            ...parameter,
            reason: parameter?.response?.reason || null,
            data: { medias: parameter?.response?.medias },
          };

        case MandatoryParameter.SHOULD_BE:
        case MandatoryParameter.MULTI_LINE:
        case MandatoryParameter.DATE:
        case MandatoryParameter.DATE_TIME:
        case MandatoryParameter.SINGLE_LINE:
        case MandatoryParameter.NUMBER:
          return {
            ...parameter,
            reason: parameter?.response?.reason || null,
            data: { ...parameter.data, input: parameter?.response?.value },
          };

        case MandatoryParameter.MULTISELECT:
        case MandatoryParameter.SINGLE_SELECT:
        case MandatoryParameter.CHECKLIST:
        case MandatoryParameter.YES_NO:
          return {
            ...parameter,
            reason: parameter?.response?.reason || null,
            data: parameter.data.map((d: any) => ({
              ...d,
              ...(parameter?.response?.choices?.[d.id] && {
                state: parameter.response.choices[d.id],
              }),
            })),
          };
        case MandatoryParameter.RESOURCE:
        case MandatoryParameter.CALCULATION:
          return {
            ...parameter,
            reason: parameter?.response?.reason || null,
            data: parameter?.response?.choices,
          };

        default:
          return parameter;
      }
  });
}

const automationInputValidator = (
  automation: AutomationAction,
  parameters: RootState['job']['parameters'],
) => {
  switch (automation.actionType) {
    case AutomationActionActionType.INCREASE_PROPERTY:
    case AutomationActionActionType.DECREASE_PROPERTY:
      const parameter = parameters.get(automation.actionDetails.parameterId!);
      const referencedParameter = parameters.get(automation.actionDetails.referencedParameterId);
      return parameter?.response?.value && referencedParameter?.response?.choices;

    case AutomationActionActionType.ARCHIVE_OBJECT:
    case AutomationActionActionType.SET_PROPERTY:
      return !!parameters.get(automation.actionDetails.referencedParameterId)?.response?.choices;

    default:
      return true;
  }
};

export const groupTaskErrors = (errors: ResponseError[]) => {
  const parametersErrors = new Map();
  const taskErrors: string[] = [];
  errors.forEach((error) => {
    if (error.code in ParameterErrors) {
      parametersErrors.set(error.id, error.message);
    } else if (error.code in TaskErrors) {
      taskErrors.push(error.message);
    }
  });

  return { parametersErrors, taskErrors };
};

// SAGA'S

function* getJobSaga({ payload }: ReturnType<typeof jobActions.getJob>) {
  try {
    const { id } = payload;

    const { data, errors }: ResponseObj<Job> = yield call(request, 'GET', apiGetSelectedJob(id));

    if (errors) {
      throw getErrorMsg(errors);
    }

    const userId = getUserId(yield select());
    const parsedJobData = parseJobData(data, userId!);

    yield put(
      jobActions.getJobSuccess({
        data: parsedJobData,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'getJobSaga', error, true);
  }
}

function* getAssignmentsSaga({ payload }: ReturnType<typeof jobActions.getAssignments>) {
  try {
    const { id } = payload;

    const { data: assignees, errors }: ResponseObj<Users> = yield call(
      request,
      'GET',
      apiGetAllUsersAssignedToJob(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    const userId = getUserId(yield select()) as string;

    yield put(
      jobActions.getAssignmentsSuccess({
        assignees,
        userId,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'getAssignmentsSaga', error, true);
  }
}

function* performTaskActionSaga({ payload }: ReturnType<typeof jobActions.performTaskAction>) {
  try {
    const { id, reason, action } = payload;
    const {
      id: jobId,
      parameters,
      tasks,
    }: RootState['job'] = yield select((state: RootState) => state.job);

    const task = tasks.get(id);

    if (!task) {
      return false;
    }

    yield put(
      jobActions.updateTaskErrors({
        id,
        taskErrors: [],
        parametersErrors: new Map(),
      }),
    );

    const isCompleteAction = [
      TaskAction.COMPLETE_WITH_EXCEPTION,
      TaskAction.COMPLETE,
      TaskAction.SKIP,
      TaskAction.COMPLETE_ERROR_CORRECTION,
    ].includes(action);

    const { data, errors, timestamp }: ResponseObj<TaskExecution> = yield call(
      request,
      'PATCH',
      apiPerformActionOnTask(id, action),
      {
        data: {
          jobId,
          ...(action === TaskAction.ENABLE_ERROR_CORRECTION
            ? {
                correctionReason: reason,
              }
            : { reason }),
          ...(isCompleteAction && {
            parameters: getParametersDataByTaskId(task, parameters),
          }),
        },
      },
    );

    const { automations: allAutomations } = task;

    const automations = allAutomations?.filter(
      (automation) => automation.actionType !== AutomationActionActionType.CREATE_OBJECT,
    );

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: shouldRefetch.message,
              jobId,
              errorType: RefetchJobErrorType.TASK,
            },
          }),
        );
        return false;
      }

      if (
        action !== TaskAction.COMPLETE_ERROR_CORRECTION &&
        isCompleteAction &&
        automations?.length
      ) {
        for (const automation of automations) {
          if (automationInputValidator(automation, parameters)) {
            const objectTypeDisplayName = parameters.get(
              automation.actionDetails.referencedParameterId,
            )?.data?.objectTypeDisplayName;
            yield put(
              showNotification({
                type: NotificationType.ERROR,
                msg: getAutomationActionTexts(automation, 'error', objectTypeDisplayName),
              }),
            );
          }
        }
      }

      const { taskErrors, parametersErrors } = groupTaskErrors(errors);
      yield put(
        jobActions.updateTaskErrors({
          id,
          taskErrors,
          parametersErrors,
        }),
      );
      throw getErrorMsg(errors);
    }

    if (
      action !== TaskAction.COMPLETE_ERROR_CORRECTION &&
      isCompleteAction &&
      automations?.length
    ) {
      for (const automation of automations) {
        if (automationInputValidator(automation, parameters)) {
          const objectTypeDisplayName = parameters.get(
            automation.actionDetails.referencedParameterId,
          )?.data?.objectTypeDisplayName;
          yield put(
            showNotification({
              type: NotificationType.SUCCESS,
              msg: getAutomationActionTexts(automation, 'success', objectTypeDisplayName),
            }),
          );
        }
      }
    }

    yield put(setRecentServerTimestamp(timestamp));
    yield put(
      jobActions.updateTaskExecution({
        id,
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'performTaskActionSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* togglePauseResumeSaga({ payload }: ReturnType<typeof jobActions.togglePauseResume>) {
  try {
    const { id, reason, comment, isTaskPaused } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<TaskExecution> = yield call(
      request,
      isTaskPaused ? 'PATCH' : 'POST',
      isTaskPaused ? apiResumeJob(id) : apiPauseJob(id),
      {
        data: { jobId, ...(!isTaskPaused && { reason, ...(comment && { comment }) }) },
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateTaskExecution({
        id,
        data,
      }),
    );
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: data.state === 'PAUSED' ? 'Task Paused successfully' : 'Task Resumed successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'togglePauseResumeSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* startJobSaga({ payload }: ReturnType<typeof jobActions.startJob>) {
  try {
    const { id } = payload;

    const { errors }: ResponseObj<Job> = yield call(request, 'PATCH', apiStartJob(id));

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: shouldRefetch.message,
              jobId: id,
              errorType: RefetchJobErrorType.JOB,
            },
          }),
        );
        return false;
      }

      throw getErrorMsg(errors);
    }

    yield put(jobActions.startJobSuccess());
    yield put(closeOverlayAction(OverlayNames.START_JOB_MODAL));
  } catch (error) {
    yield* handleCatch('Job', 'startJobSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* completeJobSaga({ payload }: ReturnType<typeof jobActions.completeJob>) {
  try {
    const { jobId, withException = false, values, details, isInboxView } = payload;

    const { errors }: ResponseObj<Job> = yield call(
      request,
      'PATCH',
      apiCompleteJob(withException, jobId),
      {
        ...(withException ? { data: { ...values } } : {}),
      },
    );

    if (withException) {
      yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
    }

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: shouldRefetch.message,
              jobId,
              errorType: RefetchJobErrorType.JOB,
            },
          }),
        );
      } else {
        if (!withException) {
          // const { taskErrors, parametersErrors } = groupTaskErrors(errors);
          // yield put(jobActions.updateTaskErrors()
        } else {
          const showInCompleteTasksError = errors.some(
            (err) => err.code in JobWithExceptionInCompleteTaskErrors,
          );
          if (showInCompleteTasksError) {
            yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
            yield put(
              openOverlayAction({
                type: OverlayNames.JOB_COMPLETE_ALL_TASKS_ERROR,
              }),
            );
          }
        }
      }
    }

    if (isInboxView) {
      navigate('/inbox');
    } else {
      navigate('/jobs');
    }
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: `JobId ${details?.code} was successfully completed ${
          withException ? 'with exception' : ''
        }`,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'completeJobSaga', error);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* executeParameterSaga({ payload }: ReturnType<typeof jobActions.executeParameter>) {
  try {
    const { parameter, reason } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Parameter> = yield call(
      request,
      'PATCH',
      apiExecuteParameter(),
      {
        data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
      },
    );

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: shouldRefetch.message,
              jobId,
              errorType: RefetchJobErrorType.PARAMETER,
            },
          }),
        );
        return false;
      }

      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameter({
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'executeParameterSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* fixParameterSaga({ payload }: ReturnType<typeof jobActions.fixParameter>) {
  try {
    const { parameter, reason } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Parameter> = yield call(
      request,
      'PATCH',
      apiExecuteParameter(),
      {
        data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
      },
    );

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: shouldRefetch.message,
              jobId,
              errorType: RefetchJobErrorType.PARAMETER,
            },
          }),
        );
        return false;
      }

      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameter({
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'fixParameterSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* approveRejectParameterSaga({
  payload,
}: ReturnType<typeof jobActions.approveRejectParameter>) {
  try {
    const { parameterId, type } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const isApproving = type === SupervisorResponse.APPROVE;

    let url: string;

    if (isApproving) {
      url = apiApproveParameter();
    } else {
      url = apiRejectParameter();
    }

    const { data, errors }: ResponseObj<Parameter> = yield call(request, 'PATCH', url, {
      data: { jobId, parameterId },
    });

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameter({
        data,
      }),
    );
    yield put(
      openOverlayAction({
        type: OverlayNames.PARAMETER_APPROVAL,
        props: {
          observationSent: false,
          observationApproved: isApproving,
          observationRejected: !isApproving,
        },
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'approveRejectParameterSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* initiateSelfVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.initiateSelfVerification>) {
  try {
    const { parameterId } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'POST',
      apiInitiateSelfVerification({ parameterId, jobId: jobId! }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'initiateSelfVerificationSaga', error, true);
  }
}

function* completeSelfVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.completeSelfVerification>) {
  try {
    const { parameterId, password } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: encrypt(password) },
    });

    if (validateErrors) {
      throw getErrorMsg(validateErrors);
    }

    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiAcceptVerification({ parameterId, jobId: jobId!, type: 'self' }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Parameter has been Self Verified Successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'completeSelfVerificationSaga', error, true);
  }
}

function* sendPeerVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.sendPeerVerification>) {
  try {
    const { parameterId, userId } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'POST',
      apiInitiatePeerVerification({ parameterId, jobId: jobId! }),
      {
        data: {
          userId,
        },
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Request for Parameter Verification Sent Successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'sendPeerVerificationSaga', error, true);
  }
}

function* recallPeerVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.recallPeerVerification>) {
  try {
    const { parameterId, type } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiRecallVerification({ parameterId, jobId: jobId!, type }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'recallPeerVerificationSaga', error, true);
  }
}

function* acceptPeerVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.acceptPeerVerification>) {
  try {
    const { parameterId, password } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: encrypt(password) },
    });

    if (validateErrors) {
      throw getErrorMsg(validateErrors);
    }

    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiAcceptVerification({ parameterId, jobId: jobId!, type: 'peer' }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'acceptPeerVerificationSaga', error, true);
  }
}

function* rejectPeerVerificationSaga({
  payload,
}: ReturnType<typeof jobActions.rejectPeerVerification>) {
  try {
    const { parameterId, comment } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiRejectPeerVerification({ parameterId, jobId: jobId! }),
      {
        data: {
          comments: comment,
        },
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterId,
        data,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job', 'rejectPeerVerificationSaga', error, true);
  }
}

export function* jobSaga() {
  yield takeLatest(JobActionsEnum.getJob, getJobSaga);
  yield takeLatest(JobActionsEnum.getAssignments, getAssignmentsSaga);
  yield takeLeading(JobActionsEnum.performTaskAction, performTaskActionSaga);
  yield takeLeading(JobActionsEnum.togglePauseResume, togglePauseResumeSaga);
  yield takeLeading(JobActionsEnum.startJob, startJobSaga);
  yield takeLeading(JobActionsEnum.completeJob, completeJobSaga);
  yield takeLatest(JobActionsEnum.executeParameter, executeParameterSaga);
  yield takeLatest(JobActionsEnum.fixParameter, fixParameterSaga);
  yield takeLeading(JobActionsEnum.approveRejectParameter, approveRejectParameterSaga);
  yield takeLeading(JobActionsEnum.initiateSelfVerification, initiateSelfVerificationSaga);
  yield takeLeading(JobActionsEnum.completeSelfVerification, completeSelfVerificationSaga);
  yield takeLeading(JobActionsEnum.sendPeerVerification, sendPeerVerificationSaga);
  yield takeLeading(JobActionsEnum.recallPeerVerification, recallPeerVerificationSaga);
  yield takeLeading(JobActionsEnum.acceptPeerVerification, acceptPeerVerificationSaga);
  yield takeLeading(JobActionsEnum.rejectPeerVerification, rejectPeerVerificationSaga);
  yield all([
    // fork other sagas here
    // fork(StagePollingSaga),
  ]);
}
