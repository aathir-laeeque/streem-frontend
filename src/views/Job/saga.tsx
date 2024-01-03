import {
  AutomationAction,
  AutomationActionActionType,
  AutomationActionTriggerType,
  TimerOperator,
} from '#PrototypeComposer/checklist.types';
import React from 'react';
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
  ParameterExecutionState,
  REFETCH_JOB_ERROR_CODES,
  StoreParameter,
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
  apiRepeatTask,
  apiRemoveRepeatTask,
  apiResumeJob,
  apiStartJob,
  apiValidatePassword,
  apiEndTaskRecurrence,
} from '#utils/apiUrls';
import { JOB_STAGE_POLLING_TIMEOUT } from '#utils/constants';
import { InputTypes, ResponseError, ResponseObj } from '#utils/globalTypes';
import { getAutomationActionTexts } from '#utils/parameterUtils';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
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

const getUserId = (state: RootState) => state.auth.userId;
const getJobStore = (state: RootState) => state.job;

// TODO: remove this and make respective changes in the Parameters
function getParametersDataByTaskId(
  task: StoreTask,
  parameters: RootState['job']['parameters'],
  taskExecutionId: string,
) {
  const { parameters: parameterIds } = task;
  return parameterIds.map((id) => {
    const parameter = parameters.get(id);
    const response = parameter?.response?.find((r) => r.taskExecutionId === taskExecutionId);
    if (parameter)
      switch (parameter.type) {
        case MandatoryParameter.SIGNATURE:
        case MandatoryParameter.MEDIA:
          return {
            ...parameter,
            reason: response?.reason || null,
            data: { medias: response?.medias },
          };

        case MandatoryParameter.SHOULD_BE:
        case MandatoryParameter.MULTI_LINE:
        case MandatoryParameter.DATE:
        case MandatoryParameter.DATE_TIME:
        case MandatoryParameter.SINGLE_LINE:
        case MandatoryParameter.NUMBER:
          return {
            ...parameter,
            reason: response?.reason || null,
            data: { ...parameter.data, input: response?.value },
          };

        case MandatoryParameter.MULTISELECT:
        case MandatoryParameter.SINGLE_SELECT:
        case MandatoryParameter.CHECKLIST:
        case MandatoryParameter.YES_NO:
          return {
            ...parameter,
            reason: response?.reason || null,
            data: parameter.data.map((d: any) => ({
              ...d,
              ...(response?.choices?.[d.id] && {
                state: response.choices[d.id],
              }),
            })),
          };
        case MandatoryParameter.RESOURCE:
        case MandatoryParameter.MULTI_RESOURCE:
        case MandatoryParameter.CALCULATION:
          return {
            ...parameter,
            reason: response?.reason || null,
            data: response?.choices,
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
      return parameter?.response[0]?.value && referencedParameter?.response[0]?.choices;

    case AutomationActionActionType.ARCHIVE_OBJECT:
    case AutomationActionActionType.SET_PROPERTY:
      return !!parameters.get(automation.actionDetails.referencedParameterId)?.response[0]?.choices;

    default:
      return true;
  }
};

const getScheduleTasksMessage = (
  scheduledTaskExecutionIds: String[],
  taskExecutions: RootState['job']['taskExecutions'],
  tasks: RootState['job']['tasks'],
  stages: RootState['job']['stages'],
) => {
  const message = scheduledTaskExecutionIds
    .map((id, index) => {
      const taskExecution = taskExecutions.get(id);
      const task = tasks.get(taskExecution?.taskId);
      const stage = stages.get(task?.stageId);
      return `Task ${stage?.orderTree}.${task?.orderTree}`;
    })
    .join('\n');

  return message;
};

export const groupTaskErrors = (errors: ResponseError[]) => {
  const parametersErrors = new Map();
  const taskErrors: string[] = [];
  errors.forEach((error) => {
    if (error.code in ParameterErrors) {
      parametersErrors.set(error.id, error.message);
    } else if (error.code in { ...TaskErrors, ...JobWithExceptionInCompleteTaskErrors }) {
      taskErrors.push(error.message);
    }
  });

  return { parametersErrors, taskErrors };
};

function* onSuccessErrorsHandler(parameter: StoreParameter) {
  try {
    const { tasks } = (yield select(getJobStore)) as JobStore;
    const task = tasks.get(parameter.taskId);
    const updatedParameterErrors = new Map<string, string[]>(task.parametersErrors);
    updatedParameterErrors.delete(parameter.id);
    yield put(
      jobActions.updateTaskErrors({
        id: parameter.taskId,
        taskErrors: task.parametersErrors.size === 1 ? [] : task.errors,
        parametersErrors: updatedParameterErrors,
      }),
    );
  } catch (error) {
    yield* handleCatch('Job Saga', 'onSuccessErrorsHandler', error);
  }
}

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
    const {
      id,
      reason,
      action,
      createObjectAutomations,
      continueRecurrence,
      recurringOverdueCompletionReason,
      recurringPrematureStartReason,
      scheduleOverdueCompletionReason,
      openAutomationModal,
    } = payload;

    const {
      id: jobId,
      parameters,
      stages,
      tasks,
      taskExecutions,
    }: RootState['job'] = yield select((state: RootState) => state.job);

    const taskExecution = taskExecutions.get(id);

    const task = tasks.get(taskExecution?.taskId);

    if (!task) {
      return false;
    }

    yield put(
      jobActions.updateTaskErrors({
        id: task.id,
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
            : {
                reason,
                continueRecurrence,
                recurringOverdueCompletionReason,
                recurringPrematureStartReason,
                scheduleOverdueCompletionReason,
              }),
          ...(isCompleteAction && {
            parameters: getParametersDataByTaskId(task, parameters, id),
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
            const parameterRefData = parameters.get(automation.actionDetails.referencedParameterId);
            yield put(
              showNotification({
                type: NotificationType.ERROR,
                msg: getAutomationActionTexts(automation, 'error', parameterRefData),
              }),
            );
          }
        }
      }

      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);
      if (shouldRefetch && shouldRefetch.code === 'E236') {
        yield put(
          openOverlayAction({
            type: OverlayNames.ADD_STOP,
            props: {
              id: shouldRefetch.id,
            },
          }),
        );
      }

      const { taskErrors, parametersErrors } = groupTaskErrors(errors);
      yield put(
        jobActions.updateTaskErrors({
          id: task.id,
          taskErrors,
          parametersErrors,
        }),
      );
      throw getErrorMsg(errors);
    }

    yield put(setRecentServerTimestamp(timestamp));
    yield put(
      jobActions.updateTaskExecution({
        id,
        data,
      }),
    );

    if (isAutomamationTriggered && filteredAutomations?.length) {
      if (filteredAutomations.length > 1) {
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: (
              <div>
                {`${filteredAutomations.length} Automations are completed successfully!`}
                {openAutomationModal && (
                  <div
                    style={{ textDecoration: 'none', color: 'blue', margin: '4px 0' }}
                    onClick={() => openAutomationModal()}
                  >
                    View All
                  </div>
                )}{' '}
              </div>
            ),
          }),
        );
      } else {
        const automation = filteredAutomations[0];
        if (automationInputValidator(automation, parameters)) {
          const parameterRefData = parameters.get(automation.actionDetails.referencedParameterId);
          yield put(
            showNotification({
              type: NotificationType.SUCCESS,
              msg: getAutomationActionTexts(automation, 'success', parameterRefData),
            }),
          );
        }
      }
    }

    if (data?.scheduledTaskExecutionIds?.length) {
      const message = getScheduleTasksMessage(
        data.scheduledTaskExecutionIds,
        taskExecutions,
        tasks,
        stages,
      );

      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: `The following tasks are scheduled:\n${message}`,
        }),
      );
    }

    if (task?.enableRecurrence && taskExecution?.continueRecurrence) {
      if (isCompleteAction && data?.continueRecurrence) {
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Recurring Task created successfully',
          }),
        );
      } else if (isCompleteAction && !data?.continueRecurrence) {
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Recurrence Ended. No new recurring task can be created.',
          }),
        );
      }
    }
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

function* repeatTaskSaga({ payload }: ReturnType<typeof jobActions.repeatTask>) {
  try {
    const { id: taskId } = payload;

    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const { data, errors } = yield call(request, 'POST', apiRepeatTask(), {
      data: {
        taskId,
        jobId,
      },
    });

    if (data) {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Repeated Task created successfully',
        }),
      );
    }

    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield put(
      openOverlayAction({
        type: OverlayNames.REPEAT_TASK_ERROR_MODAL,
      }),
    );
    yield handleCatch('Task', 'repeatTaskSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* removeRepeatTaskSaga({ payload }: ReturnType<typeof jobActions.removeRepeatTask>) {
  try {
    const { taskExecutionId } = payload;

    const { taskExecutions }: RootState['job'] = yield select((state: RootState) => state.job);
    const taskExecution = taskExecutions.get(taskExecutionId);

    const { data, errors } = yield call(request, 'DELETE', apiRemoveRepeatTask(taskExecutionId));

    if (data) {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Repeated Task removed successfully',
        }),
      );

      if (taskExecution?.previous) {
        yield put(
          jobActions.navigateByTaskId({
            id: taskExecution?.previous,
          }),
        );
      }
    }

    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield handleCatch('Task', 'removeRepeatTaskSaga', error, true);
  } finally {
    yield put(
      jobActions.setUpdating({
        updating: false,
      }),
    );
  }
}

function* endTaskRecurrenceSaga({ payload }: ReturnType<typeof jobActions.endTaskRecurrence>) {
  try {
    const { taskExecutionId } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiEndTaskRecurrence(taskExecutionId));

    if (data) {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Recurrence Ended. No new recurring task can be created.',
        }),
      );
    }

    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield handleCatch('Task', 'endTaskRecurrenceSaga', error, true);
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
    const { taskExecutions, tasks, stages }: RootState['job'] = yield select(
      (state: RootState) => state.job,
    );

    const { data, errors }: ResponseObj<Job> = yield call(request, 'PATCH', apiStartJob(id));

    if (errors) {
      throw getErrorMsg(errors);
    }

    if (data?.scheduledTaskExecutionIds?.length) {
      const message = getScheduleTasksMessage(
        data.scheduledTaskExecutionIds,
        taskExecutions,
        tasks,
        stages,
      );

      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: `The following tasks are scheduled:\n${message}`,
        }),
      );
    }

    yield put(jobActions.startJobSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Job Started',
        detail:
          'You have started the Job. To start the Task you have to press the ‘Start Task’ button',
      }),
    );
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
    const { stages, tasks }: RootState['job'] = yield select((state: RootState) => state.job);
    const { jobId, withException = false, values, details } = payload;
    const { errors, data }: ResponseObj<Job> = yield call(
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
      const { taskErrors, parametersErrors } = groupTaskErrors(errors);
      yield all(
        errors.map((error) =>
          put(
            jobActions.updateTaskErrors({
              id: error.id,
              taskErrors,
              parametersErrors,
            }),
          ),
        ),
      );

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

          const filteredErrors = errors.filter((err) => err.code === 'E223');

          if (filteredErrors.length) {
            let errorText = 'Error Correction has been initiated but not completed for Tasks:';
            const errorMessages = filteredErrors.map((error) => {
              const task = tasks.get(error.id);
              let stage;
              if (task?.stageId) {
                stage = stages.get(task.stageId);
              }
              return `${stage?.orderTree}.${task?.orderTree}`;
            });
            if (errorMessages.length > 0) {
              errorText += ` ${errorMessages.join(', ')}${errorMessages.length > 1 ? '.' : ''}`;
            }
            throw errorText;
          }
        }
      }
      throw getErrorMsg(errors);
    }

    if (data) {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: `JobId ${details?.code} was successfully completed ${
            withException ? 'with exception' : ''
          }`,
        }),
      );
      navigate('/inbox');
    }
  } catch (error) {
    yield* handleCatch('Job', 'completeJobSaga', error, true);
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
      apiExecuteParameter(parameter?.response?.id),
      {
        data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

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
    }

    yield put(
      jobActions.updateParameter({
        data,
      }),
    );
    yield* onSuccessErrorsHandler(parameter);
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
      apiFixParameter(parameter?.response?.id),
      {
        data: { jobId, parameter, ...(!!reason ? { reason } : {}) },
      },
    );

    if (errors) {
      const shouldRefetch = errors.find((error) => error.code in REFETCH_JOB_ERROR_CODES);

      if (shouldRefetch && shouldRefetch.code === 'E214') {
        yield put(
          jobActions.navigateByTaskId({
            id: shouldRefetch.id,
          }),
        );
      }
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameter({
        data,
      }),
    );
    yield* onSuccessErrorsHandler(parameter);
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
    const { parameterId, parameterResponseId, type } = payload;
    const { id: jobId }: RootState['job'] = yield select((state: RootState) => state.job);

    const isApproving = type === SupervisorResponse.APPROVE;

    let url: string;

    if (isApproving) {
      url = apiApproveParameter(parameterResponseId);
    } else {
      url = apiRejectParameter(parameterResponseId);
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
    const { parameterResponseId } = payload;

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'POST',
      apiInitiateSelfVerification({ parameterResponseId }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterResponseId,
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
    const { parameterResponseId, password, code, state } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: password ? encrypt(password) : null, code, state },
    });

    if (validateErrors) {
      throw getErrorMsg(validateErrors);
    }

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiAcceptVerification({ parameterResponseId, type: 'self' }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterResponseId,
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
    const { parameterResponseId, userId } = payload;

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'POST',
      apiInitiatePeerVerification({ parameterResponseId }),
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
        parameterResponseId,
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
    const { parameterResponseId, type } = payload;

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiRecallVerification({ parameterResponseId, type }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterResponseId,
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
    const { parameterResponseId, password, code, state } = payload;

    const { errors: validateErrors } = yield call(request, 'PATCH', apiValidatePassword(), {
      data: { password: password ? encrypt(password) : null, code, state },
    });

    if (validateErrors) {
      throw getErrorMsg(validateErrors);
    }

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiAcceptVerification({ parameterResponseId, type: 'peer' }),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      jobActions.updateParameterVerifications({
        parameterResponseId,
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
    const { parameterResponseId, comment } = payload;

    const { data, errors }: ResponseObj<Verification> = yield call(
      request,
      'PATCH',
      apiRejectPeerVerification({ parameterResponseId }),
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
        parameterResponseId,
        data,
      }),
    );
    yield put(closeOverlayAction(OverlayNames.REASON_MODAL));
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
        const parsedJobData = parseJobData(updatedJobData, userId!, jobStore, stageId);
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
      const { taskExecutions, tasks, timerState } = (yield select(getJobStore)) as JobStore;
      const _timerState = { ...timerState };
      const taskExecution = taskExecutions.get(id);

      if (taskExecution) {
        const task = tasks.get(taskExecution.taskId)!;
        const { state, duration } = taskExecution;
        // duration is updated only ttaskExecutionsByIdhrough stage polling ie (BE is the source of truth)
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
      triggeredOn: formatDateTime({ value: el.triggeredAt, type: InputTypes.DATE }),
    }));

    yield put(
      jobActions.getJobAuditLogsSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    yield* handleCatch('JobParameter', 'fetchJobAuditLogsSaga', e);
  }
}

export function* jobSaga() {
  yield takeLatest(JobActionsEnum.getJob, getJobSaga);
  yield takeLatest(JobActionsEnum.getAssignments, getAssignmentsSaga);
  yield takeLeading(JobActionsEnum.performTaskAction, performTaskActionSaga);
  yield takeLeading(JobActionsEnum.repeatTask, repeatTaskSaga);
  yield takeLeading(JobActionsEnum.removeRepeatTask, removeRepeatTaskSaga);
  yield takeLeading(JobActionsEnum.endTaskRecurrence, endTaskRecurrenceSaga);
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
