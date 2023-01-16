import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
import { apiEnableTaskErrorCorrection, apiPerformActionOnTask } from '#utils/apiUrls';
import { request } from '#utils/request';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import { apiCancelTaskErrorCorrection, apiCompleteTaskErrorCorrection } from '../../utils/apiUrls';
import { setParameterError } from '../ActivityList/actions';
import { MandatoryParameter, Task } from '../checklist.types';
import { ErrorGroups } from '../composer.types';
import { groupJobErrors } from '../utils';
import { Error } from './../../utils/globalTypes';
import { removeParameterError } from './../ActivityList/actions';
import {
  cancelErrorCorrection,
  completeErrorCorrection,
  completeTask,
  enableErrorCorrection,
  removeTaskError,
  setTaskError,
  skipTask,
  startTask,
  updateTaskExecutionState,
} from './actions';
import { TaskListAction } from './reducer.types';
import { CompletedTaskErrors, TaskAction } from './types';
import { getAutomationActionTexts } from './utils';

type TaskErrorSagaPayload = ErrorGroups & {
  taskId: Task['id'];
};

function* getParametersDataByTaskId(taskId: string) {
  const { tasksById } = yield select((state: RootState) => state.composer.tasks);
  const { parametersById } = yield select((state: RootState) => state.composer.parameters);
  const task = tasksById[taskId];
  return task.parameters.map(({ id }: any) => {
    const parameter = parametersById[id];
    switch (parameter.type) {
      case MandatoryParameter.SIGNATURE:
      case MandatoryParameter.MEDIA:
        return {
          ...parameter,
          reason: parameter.response.reason || null,
          data: { medias: parameter.response.medias },
        };

      case MandatoryParameter.SHOULD_BE:
      case MandatoryParameter.MULTI_LINE:
        return {
          ...parameter,
          reason: parameter.response.reason || null,
          data: { ...parameter.data, input: parameter.response.value },
        };

      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.SINGLE_SELECT:
      case MandatoryParameter.CHECKLIST:
      case MandatoryParameter.YES_NO:
        return {
          ...parameter,
          reason: parameter.response.reason || null,
          data: parameter.data.map((d: any) => ({
            ...d,
            ...(parameter.response.choices?.[d.id] && {
              state: parameter.response.choices[d.id],
            }),
          })),
        };

      default:
        return parameter;
    }
  });
}

function* taskCompleteErrorSaga(payload: TaskErrorSagaPayload) {
  const { parametersErrors, taskId, automations = null } = payload;

  if (parametersErrors.length) {
    console.log('handle parameters level error here');
    yield all(parametersErrors.map((error) => put(setParameterError(error, error.id))));
  }

  yield put(setTaskError('Parameter Incomplete', taskId));
}

function* performActionOnTaskSaga({
  payload,
}: ReturnType<typeof startTask | typeof completeTask | typeof skipTask>) {
  try {
    console.log('came to performActionOnTaskSaga with payload :: ', payload);

    const { jobState, entityId: jobId } = yield select((state: RootState) => state.composer);

    const isJobStarted = jobState === JobStateEnum.IN_PROGRESS;

    const { taskId, action, reason = null, automations = null } = payload;

    if (isJobStarted) {
      const { data, errors, timestamp } = yield call(
        request,
        'PATCH',
        apiPerformActionOnTask(taskId, action),
        {
          data: {
            jobId,
            reason,
            ...(action !== TaskAction.START && {
              parameters: yield* getParametersDataByTaskId(taskId),
            }),
          },
        },
      );

      if (data) {
        if (action === TaskAction.COMPLETE_WITH_EXCEPTION) {
          const {
            stages: { activeStageId },
          } = yield select((state: RootState) => state.composer);

          const parametersId: string[] = yield select(
            (state: RootState) =>
              state.composer.parameters.parametersOrderInTaskInStage[activeStageId][taskId],
          );

          yield put(removeTaskError(taskId));

          yield all(parametersId.map((parameterId) => put(removeParameterError(parameterId))));
        }

        if (automations) {
          for (let i = 0; i < automations.length; i++) {
            yield put(
              showNotification({
                type: NotificationType.SUCCESS,
                msg: getAutomationActionTexts(automations[i], 'success'),
              }),
            );
          }
        }

        yield put(setRecentServerTimestamp(timestamp));
        yield put(updateTaskExecutionState(taskId, data));
      } else {
        if (automations) {
          for (let i = 0; i < automations.length; i++) {
            yield put(
              showNotification({
                type: NotificationType.ERROR,
                msg: getAutomationActionTexts(automations[i], 'error'),
              }),
            );
          }
        }

        const hasCompletedTaskError = (errors as Error[]).find(
          (err) => err.code in CompletedTaskErrors,
        );
        if (hasCompletedTaskError) {
          yield put(
            openOverlayAction({
              type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
              props: {
                modalTitle: hasCompletedTaskError.message,
                jobId,
                errorType: RefetchJobErrorType.TASK,
              },
            }),
          );
        } else {
          const { stagesErrors, tasksErrors, parametersErrors, signOffErrors } =
            groupJobErrors(errors);

          if (action === TaskAction.COMPLETE || action === TaskAction.COMPLETE_WITH_EXCEPTION) {
            yield taskCompleteErrorSaga({
              stagesErrors,
              tasksErrors,
              parametersErrors,
              signOffErrors,
              taskId,
            });
          }
        }
      }
    } else {
      console.log('open modal to start the job');
      yield put(
        openOverlayAction({
          type: OverlayNames.START_JOB_MODAL,
          props: {},
        }),
      );
    }
  } catch (error) {
    console.error('error came in performActionOnTaskSaga in TaskListSaga :: ', error);
  } finally {
    const { setLoadingState } = payload;
    setLoadingState(false);
  }
}

function* enableErrorCorrectionSaga({ payload }: ReturnType<typeof enableErrorCorrection>) {
  console.log('came in correction saga ::', payload);
  try {
    const { taskId, correctionReason } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiEnableTaskErrorCorrection(taskId), {
      data: { correctionReason, jobId },
    });

    if (data) {
      console.log('data :: ', data);

      yield put(updateTaskExecutionState(taskId, data));
    } else {
      const alreadyEnabledErrorCorrection = (errors as Error[]).find((err) => err.code === 'E223');

      if (alreadyEnabledErrorCorrection) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: alreadyEnabledErrorCorrection.message,
              jobId,
              errorType: RefetchJobErrorType.TASK,
            },
          }),
        );
      }
    }
  } catch (error) {
    console.error('error came in enableErrorCorrectionSaga :: ', error);
  } finally {
    const { setLoadingState } = payload;
    setLoadingState(false);
  }
}

function* completeErrorCorrectionSaga({ payload }: ReturnType<typeof completeErrorCorrection>) {
  console.log('came in correction saga ::', payload);
  try {
    const { taskId } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiCompleteTaskErrorCorrection(taskId), {
      data: { jobId, parameters: yield* getParametersDataByTaskId(taskId) },
    });

    if (data) {
      yield put(updateTaskExecutionState(taskId, data));
    } else {
      const hasCompletedTaskError = (errors as Error[]).find(
        (err) => err.code in CompletedTaskErrors,
      );
      if (hasCompletedTaskError) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: hasCompletedTaskError.message,
              jobId,
              errorType: RefetchJobErrorType.TASK,
            },
          }),
        );
      } else {
        const { stagesErrors, tasksErrors, parametersErrors, signOffErrors } =
          groupJobErrors(errors);

        yield taskCompleteErrorSaga({
          stagesErrors,
          tasksErrors,
          parametersErrors,
          signOffErrors,
          taskId,
        });
      }
    }
  } catch (error) {
    console.error('error came in completeErrorCorrectionSaga :: ', error);
  } finally {
    const { setLoadingState } = payload;
    setLoadingState(false);
  }
}

function* cancelErrorCorrectionSaga({ payload }: ReturnType<typeof cancelErrorCorrection>) {
  console.log('came to error correction saga ::', payload);
  try {
    const { taskId } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(request, 'PATCH', apiCancelTaskErrorCorrection(taskId), {
      data: { jobId },
    });

    if (data) {
      yield put(updateTaskExecutionState(taskId, data));
    } else {
      const taskNotEnabledForErrorCorrection = (errors as Error[]).find(
        (err) => err.code === 'E214',
      );

      if (taskNotEnabledForErrorCorrection) {
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: taskNotEnabledForErrorCorrection.message,
              jobId,
              errorType: RefetchJobErrorType.TASK,
            },
          }),
        );
      }
    }
  } catch (error) {
    console.error('error came in cancelErrorCorrectionSaga :: ', error);
  } finally {
    const { setLoadingState } = payload;
    setLoadingState(false);
  }
}

export function* TaskListSaga() {
  yield takeLeading(TaskListAction.START_TASK, performActionOnTaskSaga);
  yield takeLeading(TaskListAction.COMPLETE_TASK, performActionOnTaskSaga);
  yield takeLeading(TaskListAction.SKIP_TASK, performActionOnTaskSaga);
  yield takeLeading(TaskListAction.COMPLETE_TASK_WITH_EXCEPTION, performActionOnTaskSaga);
  yield takeLeading(TaskListAction.ENABLE_TASK_ERROR_CORRECTION, enableErrorCorrectionSaga);
  yield takeLeading(TaskListAction.COMPLTE_ERROR_CORRECTION, completeErrorCorrectionSaga);
  yield takeLeading(TaskListAction.CANCEL_ERROR_CORRECTION, cancelErrorCorrectionSaga);
}
