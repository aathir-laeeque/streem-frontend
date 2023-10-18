import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
import { Users } from '#store/users/types';
import {
  JobAuditLogType,
  JobStore,
  JobWithExceptionInCompleteTaskErrors,
  MandatoryParameter,
  Parameter,
  ParameterErrors,
  REFETCH_JOB_ERROR_CODES,
  StoreTask,
  SupervisorResponse,
  TaskAction,
  TaskErrors,
  TaskExecution,
} from '#types';
import {
  apiAcceptVerification,
  apiApproveParameter,
  apiCompleteJob,
  apiExecuteParameter,
  apiFixParameter,
  apiGetAllUsersAssignedToJob,
  apiGetJobAuditLogs,
  apiGetSelectedJob,
  apiGetStageData,
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
import { CompletedJobStates, Job, Verification } from '#views/Jobs/ListView/types';
import { navigate } from '@reach/router';
import {
  all,
  call,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';
import { JobActionsEnum, initialState, jobActions } from './jobStore';
import { parseJobData } from './utils';
import moment from 'moment';
import { getAutomationActionTexts } from '#utils/parameterUtils';
import {
  AutomationAction,
  AutomationActionActionType,
  AutomationActionTriggerType,
  TimerOperator,
} from '#PrototypeComposer/checklist.types';
import { JOB_STAGE_POLLING_TIMEOUT } from '#utils/constants';

const getUserId = (state: RootState) => state.auth.userId;
const getJobStore = (state: RootState) => state.job;

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
        jobFromBE: data,
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
    const { id, reason, action, createObjectAutomations } = payload;
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
          ...(createObjectAutomations?.length > 0 && {
            createObjectAutomations,
          }),
        },
      },
    );

    const { automations: allAutomations } = task;
    const isAutomamationTriggered = [TaskAction.COMPLETE, TaskAction.START].includes(action);
    let filteredAutomations: AutomationAction[] = [];

    if (action === TaskAction.COMPLETE) {
      filteredAutomations = allAutomations?.filter(
        (automation: AutomationAction) =>
          automation.triggerType === AutomationActionTriggerType.TASK_COMPLETED,
      );
    } else if (action === TaskAction.START) {
      filteredAutomations = allAutomations?.filter(
        (automation: AutomationAction) =>
          automation.triggerType === AutomationActionTriggerType.TASK_STARTED,
      );
    }

    if (errors) {
      if (isAutomamationTriggered && filteredAutomations?.length) {
        for (const automation of filteredAutomations) {
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

    if (isAutomamationTriggered && filteredAutomations?.length) {
      for (const automation of filteredAutomations) {
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
    const { jobId, withException = false, values, details } = payload;

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

    navigate(-1);
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
      apiFixParameter(),
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
    const { parameterId, password, code, state } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: password ? encrypt(password) : null, code, state },
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
    const { parameterId, password, code, state } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: password ? encrypt(password) : null, code, state },
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

    if (data) {
      yield put(
        jobActions.updateParameterVerifications({
          parameterId,
          data,
        }),
      );
      yield put(closeOverlayAction(OverlayNames.REASON_MODAL));
    }
  } catch (error) {
    yield* handleCatch('Job', 'rejectPeerVerificationSaga', error, true);
  }
}

function* activeStagePollingSaga(
  payload: ReturnType<typeof jobActions.startPollActiveStageData>['payload'],
) {
  const { jobId, state, stageId } = payload;
  while (true) {
    try {
      if (state in CompletedJobStates) {
        yield put(jobActions.stopPollActiveStageData());
      }
      const { data, errors } = yield call(request, 'GET', apiGetStageData(jobId, stageId));

      if (errors) {
        throw 'Could Not Fetch Active Stage Data';
      }
      const userId = (yield select(getUserId)) as string;
      const jobStore = (yield select(getJobStore)) as JobStore;
      const { jobFromBE } = jobStore;
      if (jobFromBE && userId) {
        const updatedJobData = {
          ...jobFromBE,
          state: data.jobState,
          checklist: {
            ...jobFromBE.checklist,
            stages: jobFromBE.checklist.stages.map((stage: any) => {
              if (stage.id === data.stage.id) {
                return data.stage;
              }
              return stage;
            }),
          },
        };
        const parsedJobData = parseJobData(updatedJobData, userId!, jobStore);
        yield put(
          jobActions.getJobSuccess({
            data: parsedJobData,
            jobFromBE: updatedJobData,
          }),
        );
      }

      if (data.jobState in CompletedJobStates) {
        yield put(jobActions.stopPollActiveStageData());
      }

      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    } catch (err) {
      console.error('error from startPollActiveStageData in Job Saga :: ', err);
      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    }
  }
}

/**
 * Saga to update the timer state of the task
 * This saga keeps track of task's duration provided by the BE & keeps incrementing by 1/sec till its changed.
 */
function* taskTimerSaga(payload: ReturnType<typeof jobActions.startTaskTimer>['payload']) {
  const { id } = payload;
  // default time elapsed value
  let previousTaskDuration: number = 0;
  // reset the timer state on task change
  yield put(jobActions.setTimerState(initialState.timerState));
  while (true) {
    try {
      // get the current task and timer state
      const { tasks, timerState } = (yield select(getJobStore)) as JobStore;
      const _timerState = { ...timerState };
      const task = tasks.get(id);
      if (task) {
        const { state, duration } = task.taskExecution;
        // duration is updated only through stage polling ie (BE is the source of truth)
        // it could be null if the task is not started, so only update the time elapsed if the duration is not null or 0
        // BUG: duration is not updated in the taskExecution object when the task is completed [BE bug]
        if (duration && previousTaskDuration !== duration) {
          previousTaskDuration = duration;
          _timerState.timeElapsed = duration;
        } else {
          _timerState.timeElapsed++;
        }

        // task.timerOperator is null for tasks that are not time bound
        if (task.timerOperator === TimerOperator.NOT_LESS_THAN) {
          if (task.minPeriod && _timerState.timeElapsed < task.minPeriod) {
            _timerState.earlyCompletion = true;
          } else {
            _timerState.earlyCompletion = false;
          }
        }

        if (task.maxPeriod && _timerState.timeElapsed > task.maxPeriod) {
          _timerState.limitCrossed = true;
        }

        yield put(jobActions.setTimerState(_timerState));

        // if task is not in progress, stop the timer
        if (state !== 'IN_PROGRESS') {
          yield put(jobActions.stopTaskTimer());
        }
      }

      // wait for 1 second before updating the timer
      yield delay(1000);
    } catch (err) {
      console.error('error from taskTimerSaga in Job Saga :: ', err);
      yield put(jobActions.stopTaskTimer());
    }
  }
}

function* StagePollSaga() {
  while (true) {
    const { payload } = yield take(JobActionsEnum.startPollActiveStageData);
    yield race([
      call(activeStagePollingSaga, payload),
      take(JobActionsEnum.stopPollActiveStageData),
    ]);
  }
}

function* TaskTimerSaga() {
  while (true) {
    const { payload } = yield take(JobActionsEnum.startTaskTimer);
    yield race([call(taskTimerSaga, payload), take(JobActionsEnum.stopTaskTimer)]);
  }
}

function* jobAuditLogsSaga({ payload }: ReturnType<typeof jobActions.getJobAuditLogs>) {
  try {
    const { jobId, params } = payload;

    const { data, pageable, errors }: ResponseObj<JobAuditLogType[]> = yield call(
      request,
      'GET',
      apiGetJobAuditLogs(jobId),
      { params },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      jobActions.getJobAuditLogsSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    const error = yield* handleCatch('JobParameter', 'fetchJobAuditLogsSaga', e);
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
  yield takeLatest(JobActionsEnum.getJobAuditLogs, jobAuditLogsSaga);
  // Keep this at the very last
  yield all([fork(StagePollSaga), fork(TaskTimerSaga)]);
}
