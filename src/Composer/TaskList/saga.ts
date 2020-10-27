import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import {
  apiAssignUsersToTask,
  apiEnableTaskErrorCorrection,
  apiPerformActionOnTask,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { setActivityError } from '../ActivityList/actions';
import { Task } from '../checklist.types';
import { ErrorGroups, JobStatus } from '../composer.types';
import { groupJobErrors } from '../utils';
import {
  cancelErrorCorretcion,
  completeErrorCorretcion,
  completeTask,
  enableErrorCorrection,
  setTaskError,
  skipTask,
  startTask,
  updateTaskExecutionStatus,
  assignUsersToTask,
  revertUsersForTask,
} from './actions';
import { TaskAction } from './types';
import { TaskListAction } from './reducer.types';
import {
  apiCompleteTaskErrorCorrection,
  apiCancelTaskErrorCorrection,
} from '../../utils/apiUrls';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';

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

    const { jobStatus, entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const isJobStarted = jobStatus === JobStatus.INPROGRESS;

    const { taskId, action, reason } = payload;

    if (isJobStarted) {
      const { data, errors } = yield call(
        request,
        'PUT',
        apiPerformActionOnTask(taskId, action),
        {
          data: {
            jobId,
            ...(reason && { reason }),
          },
        },
      );

      if (data) {
        console.log('data from api call in performActionOnTaskSaga :: ', data);

        yield put(updateTaskExecutionStatus(taskId, data));
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
  console.log('came to error correction saga ::', payload);
  try {
    const { taskId, correctionReason } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(
      request,
      'PUT',
      apiEnableTaskErrorCorrection(taskId),
      { data: { correctionReason, jobId } },
    );

    if (data) {
      console.log('data :: ', data);

      yield put(updateTaskExecutionStatus(taskId, data));
    }
  } catch (error) {
    console.error('error came in enableErrorCorrectionSaga :: ', error);
  }
}

function* completeErrorCorrectionSaga({
  payload,
}: ReturnType<typeof completeErrorCorretcion>) {
  console.log('came to error correction saga ::', payload);
  try {
    const { taskId } = payload;

    const { entityId: jobId } = yield select((state) => state.composer);

    const { data, errors } = yield call(
      request,
      'PUT',
      apiCompleteTaskErrorCorrection(taskId),
      { data: { jobId } },
    );

    if (data) {
      yield put(updateTaskExecutionStatus(taskId, data));
    } else {
      const groupedErrors = groupJobErrors(errors);

      yield taskCompleteErrorSaga({ ...groupedErrors, taskId });
    }
  } catch (error) {
    console.error('error came in enableErrorCorrectionSaga :: ', error);
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
      'PUT',
      apiCancelTaskErrorCorrection(taskId),
      { data: { jobId } },
    );

    if (data) {
      yield put(updateTaskExecutionStatus(taskId, data));
    }
  } catch (error) {
    console.error('error came in enableErrorCorrectionSaga :: ', error);
  }
}

function* assignUsersToTaskSaga({
  payload,
}: ReturnType<typeof assignUsersToTask>) {
  const {
    taskId,
    jobId,
    assignIds,
    unassignIds,
    preAssigned,
    notify,
  } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiAssignUsersToTask(taskId),
      {
        data: {
          jobId,
          assignIds,
          unassignIds,
        },
      },
    );

    if (errors || error) {
      throw 'Could Not Assign Users';
    }

    yield put(
      openOverlayAction({
        type: OverlayNames.ASSIGNMENT_SUCCESS,
        props: { notify },
      }),
    );
  } catch (error) {
    console.error(
      'error from assignUsersToTaskSaga function in Task :: ',
      error,
    );
    yield put(revertUsersForTask(preAssigned, taskId));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Assign Users',
      }),
    );
  }
}

export function* TaskListSaga() {
  yield takeLatest(TaskListAction.START_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.COMPLETE_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.SKIP_TASK, performActionOnTaskSaga);
  yield takeLatest(
    TaskListAction.COMPLETE_TASK_WITH_EXCEPTION,
    performActionOnTaskSaga,
  );
  yield takeLatest(
    TaskListAction.ENABLE_TASK_ERROR_CORRECTION,
    enableErrorCorrectionSaga,
  );
  yield takeLatest(
    TaskListAction.COMPLTE_ERROR_CORRECTION,
    completeErrorCorrectionSaga,
  );
  yield takeLatest(
    TaskListAction.CANCEL_ERROR_CORRECTION,
    cancelErrorCorrectionSaga,
  );
  yield takeLatest(TaskListAction.ASSIGN_USERS_TO_TASK, assignUsersToTaskSaga);
}
