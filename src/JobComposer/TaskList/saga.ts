import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
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
import { Task } from '../checklist.types';
import { ErrorGroups } from '../composer.types';
import { groupJobErrors } from '../utils';
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
import { TaskAction } from './types';

type TaskErrorSagaPayload = ErrorGroups & {
  taskId: Task['id'];
};

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

    const { taskId, action, reason } = payload;

    if (isJobStarted) {
      const { data, errors, timestamp } = yield call(
        request,
        'PATCH',
        apiPerformActionOnTask(taskId, action),
        {
          data: {
            jobId,
            ...(reason && { reason }),
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

        yield put(updateTaskExecutionState(taskId, data));
        yield put(setRecentServerTimestamp(timestamp));
      } else {
        const groupedErrors = groupJobErrors(errors);
        if (
          action === TaskAction.COMPLETE ||
          action === TaskAction.COMPLETE_WITH_EXCEPTION
        ) {
          yield taskCompleteErrorSaga({ ...groupedErrors, taskId });
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
    }
  } catch (error) {
    console.error('error came in enableErrorCorrectionSaga :: ', error);
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
      { data: { jobId } },
    );

    if (data) {
      yield put(updateTaskExecutionState(taskId, data));
    } else {
      const groupedErrors = groupJobErrors(errors);

      yield taskCompleteErrorSaga({ ...groupedErrors, taskId });
    }
  } catch (error) {
    console.error('error came in completeErrorCorrectionSaga :: ', error);
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
    }
  } catch (error) {
    console.error('error came in cancelErrorCorrectionSaga :: ', error);
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
