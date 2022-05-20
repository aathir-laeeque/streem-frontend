import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RefetchJobErrorType } from '#JobComposer/modals/RefetchJobComposerData';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
import {
  apiEnableTaskErrorCorrection,
  apiPerformActionOnTask,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { JobStateEnum } from '#views/Jobs/NewListView/types';
import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import {
  apiCancelTaskErrorCorrection,
  apiCompleteTaskErrorCorrection,
} from '../../utils/apiUrls';
import { setActivityError } from '../ActivityList/actions';
import { MandatoryActivity, Task } from '../checklist.types';
import { ErrorGroups } from '../composer.types';
import { groupJobErrors } from '../utils';
import { Error } from './../../utils/globalTypes';
import { removeActivityError } from './../ActivityList/actions';
import {
  cancelErrorCorretcion,
  completeErrorCorretcion,
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

type TaskErrorSagaPayload = ErrorGroups & {
  taskId: Task['id'];
};

function* getActivitiesDataByTaskId(taskId: string) {
  const { tasksById } = yield select(
    (state: RootState) => state.composer.tasks,
  );
  const { activitiesById } = yield select(
    (state: RootState) => state.composer.activities,
  );
  const task = tasksById[taskId];
  return task.activities.map(({ id }: any) => {
    const activity = activitiesById[id];
    switch (activity.type) {
      case MandatoryActivity.SIGNATURE:
      case MandatoryActivity.MEDIA:
        return {
          ...activity,
          reason: activity.response.reason || null,
          data: { medias: activity.response.medias },
        };

      case MandatoryActivity.SHOULD_BE:
      case MandatoryActivity.PARAMETER:
      case MandatoryActivity.TEXTBOX:
        return {
          ...activity,
          reason: activity.response.reason || null,
          data: { ...activity.data, input: activity.response.value },
        };

      case MandatoryActivity.MULTISELECT:
      case MandatoryActivity.SINGLE_SELECT:
      case MandatoryActivity.CHECKLIST:
      case MandatoryActivity.YES_NO:
        return {
          ...activity,
          reason: activity.response.reason || null,
          data: activity.data.map((d: any) => ({
            ...d,
            ...(activity.response.choices?.[d.id] && {
              state: activity.response.choices[d.id],
            }),
          })),
        };

      default:
        return activity;
    }
  });
}

function* taskCompleteErrorSaga(payload: TaskErrorSagaPayload) {
  const { activitiesErrors, taskId } = payload;

  if (activitiesErrors.length) {
    console.log('handle activities level error here');
    yield all(
      activitiesErrors.map((error) => put(setActivityError(error, error.id))),
    );
  }

  yield put(setTaskError('Activity Incomplete', taskId));
}

function* performActionOnTaskSaga({
  payload,
}: ReturnType<typeof startTask | typeof completeTask | typeof skipTask>) {
  try {
    console.log('came to performActionOnTaskSaga with payload :: ', payload);

    const { jobState, entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const isJobStarted = jobState === JobStateEnum.IN_PROGRESS;

    const { taskId, action, reason = null } = payload;

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
              activities: yield* getActivitiesDataByTaskId(taskId),
            }),
          },
        },
      );

      if (data) {
        if (action === TaskAction.COMPLETE_WITH_EXCEPTION) {
          const {
            stages: { activeStageId },
          } = yield select((state: RootState) => state.composer);

          const activitiesId: string[] = yield select(
            (state: RootState) =>
              state.composer.activities.activitiesOrderInTaskInStage[
                activeStageId
              ][taskId],
          );

          yield put(removeTaskError(taskId));

          yield all(
            activitiesId.map((activityId) =>
              put(removeActivityError(activityId)),
            ),
          );
        }

        yield put(setRecentServerTimestamp(timestamp));
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
          const { stagesErrors, tasksErrors, activitiesErrors, signOffErrors } =
            groupJobErrors(errors);

          if (
            action === TaskAction.COMPLETE ||
            action === TaskAction.COMPLETE_WITH_EXCEPTION
          ) {
            yield taskCompleteErrorSaga({
              stagesErrors,
              tasksErrors,
              activitiesErrors,
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
    console.error(
      'error came in performActionOnTaskSaga in TaskListSaga :: ',
      error,
    );
  } finally {
    const { setLoadingState } = payload;
    setLoadingState(false);
  }
}

function* enableErrorCorrectionSaga({
  payload,
}: ReturnType<typeof enableErrorCorrection>) {
  console.log('came in correction saga ::', payload);
  try {
    const { taskId, correctionReason } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiEnableTaskErrorCorrection(taskId),
      { data: { correctionReason, jobId } },
    );

    if (data) {
      console.log('data :: ', data);

      yield put(updateTaskExecutionState(taskId, data));
    } else {
      const alreadyEnabledErrorCorrection = (errors as Error[]).find(
        (err) => err.code === 'E223',
      );

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

function* completeErrorCorrectionSaga({
  payload,
}: ReturnType<typeof completeErrorCorretcion>) {
  console.log('came in correction saga ::', payload);
  try {
    const { taskId } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiCompleteTaskErrorCorrection(taskId),
      { data: { jobId, activities: yield* getActivitiesDataByTaskId(taskId) } },
    );

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
        const { stagesErrors, tasksErrors, activitiesErrors, signOffErrors } =
          groupJobErrors(errors);

        yield taskCompleteErrorSaga({
          stagesErrors,
          tasksErrors,
          activitiesErrors,
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

function* cancelErrorCorrectionSaga({
  payload,
}: ReturnType<typeof cancelErrorCorretcion>) {
  console.log('came to error correction saga ::', payload);
  try {
    const { taskId } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiCancelTaskErrorCorrection(taskId),
      { data: { jobId } },
    );

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
  yield takeLeading(
    TaskListAction.COMPLETE_TASK_WITH_EXCEPTION,
    performActionOnTaskSaga,
  );
  yield takeLeading(
    TaskListAction.ENABLE_TASK_ERROR_CORRECTION,
    enableErrorCorrectionSaga,
  );
  yield takeLeading(
    TaskListAction.COMPLTE_ERROR_CORRECTION,
    completeErrorCorrectionSaga,
  );
  yield takeLeading(
    TaskListAction.CANCEL_ERROR_CORRECTION,
    cancelErrorCorrectionSaga,
  );
}
