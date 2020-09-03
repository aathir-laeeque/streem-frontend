import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { RootState } from '#store';
import { apiPerformActionOnTask } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { Error } from '../../utils/globalTypes';
import { setActivityError } from '../ActivityList/actions';
import { ActivityErrors } from '../ActivityList/types';
import { Task } from '../checklist.types';
import { setActiveStage } from '../StageList/actions';
import { StageListAction, StageErrors } from '../StageList/types';
import { JobStatus } from '../types';
import {
  setTaskError,
  setTasksList,
  startTask,
  updateTaskExecutionStatus,
} from './actions';
import { TaskAction, TaskListAction, TaskErrors } from './types';
import { handleActivityErrorSaga } from '../ActivityList/saga';

function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
  try {
    const { listById } = yield select(
      (state: RootState) => state.composer.stages,
    );

    yield put(setTasksList(listById[payload.id].tasks));
  } catch (error) {
    console.log('error came in setTasksSaga in TaskListSaga :: => ', error);
  }
}

type ErrorGroups = {
  stagesErrors: Error[];
  tasksErrors: Error[];
  activitiesErrors: Error[];
};

const groupJobErrors = (errors: Error[]) =>
  errors.reduce<ErrorGroups>(
    (acc, error) => {
      if (error.code in ActivityErrors) {
        acc.activitiesErrors.push(error);
      } else if (error.code in TaskErrors) {
        acc.tasksErrors.push(error);
      } else if (error.code in StageErrors) {
        acc.stagesErrors.push(error);
      }

      return acc;
    },
    { stagesErrors: [], tasksErrors: [], activitiesErrors: [] },
  );

type TaskErrorSagaPayload = ErrorGroups & {
  taskId: Task['id'];
};

function* taskCompleteErrorSaga(payload: TaskErrorSagaPayload) {
  const { activitiesErrors, taskId, tasksErrors } = payload;

  if (tasksErrors.length) {
    console.log('handle task level error here');
  } else if (activitiesErrors.length) {
    console.log('handle activities level error here');
    yield all(
      activitiesErrors.map((error) =>
        call(handleActivityErrorSaga, { error, taskId }),
      ),
    );
  }

  yield put(setTaskError('Activity Incomplete', taskId));
}

function* taskStartErrorSaga(payload: TaskErrorSagaPayload) {
  console.log('payload frm taskStartErrorSaga :: ', payload);
}

function* taskSkipErrorSaga(payload: TaskErrorSagaPayload) {
  console.log('payload frm taskSkipErrorSaga :: ', payload);
}

function* performActionOnTaskSaga({ payload }: ReturnType<typeof startTask>) {
  try {
    console.log('came to performActionOnTaskSaga with payload :: ', payload);
    const { jobStatus, entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const isJobStarted = jobStatus === JobStatus.INPROGRESS;

    const { taskId, action } = payload;

    if (isJobStarted) {
      console.log('make api call to start the task with taskId :: ', taskId);

      const { data, errors } = yield call(
        request,
        'PUT',
        apiPerformActionOnTask(taskId, action),
        { data: { jobId } },
      );

      if (data) {
        console.log('data from start task api call :: ', data);

        yield put(updateTaskExecutionStatus(taskId, data));
      } else {
        console.log('Error came is perform action on task api ::: ', errors);

        const groupedErrors = groupJobErrors(errors);

        if (action === TaskAction.COMPLETE) {
          yield taskCompleteErrorSaga({ ...groupedErrors, taskId });
        } else if (action === TaskAction.START) {
          yield taskStartErrorSaga(errors);
        } else if (action === TaskAction.SKIP) {
          yield taskSkipErrorSaga(errors);
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
  yield takeLatest(StageListAction.SET_ACTIVE_STAGE, setTasksSaga);
  yield takeLatest(TaskListAction.START_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.COMPLETE_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.SKIP_TASK, performActionOnTaskSaga);
}
