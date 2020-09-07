import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { RootState } from '#store';
import { apiPerformActionOnTask } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { setActivityError } from '../ActivityList/actions';
import { Task } from '../checklist.types';
import { ErrorGroups, JobStatus } from '../types';
import { groupJobErrors } from '../utils';
import {
  completeTask,
  setTaskError,
  skipTask,
  startTask,
  updateTaskExecutionStatus,
} from './actions';
import { TaskAction, TaskListAction } from './types';

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
        openModalAction({
          type: ModalNames.START_JOB_MODAL,
          props: { taskId, jobId },
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

export function* TaskListSaga() {
  yield takeLatest(TaskListAction.START_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.COMPLETE_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.SKIP_TASK, performActionOnTaskSaga);
  yield takeLatest(
    TaskListAction.COMPLETE_TASK_WITH_EXCEPTION,
    performActionOnTaskSaga,
  );
}
