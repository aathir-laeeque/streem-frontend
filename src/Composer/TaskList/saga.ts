import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { RootState } from '#store';
import { apiPerformActionOnTask } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { setActiveStage } from '../StageList/actions';
import { StageListAction } from '../StageList/types';
import { JobStatus } from '../types';
import {
  addNewTask,
  setTasksList,
  startTask,
  updateTaskExecutionStatus,
} from './actions';
import { TaskListAction } from './types';

function* addNewTaskSaga({ payload }: ReturnType<typeof addNewTask>) {
  console.log('make api call to create a new task in BE');
  console.log('payload for the api :: ', payload);
}

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

function* performActionOnTaskSaga({ payload }: ReturnType<typeof startTask>) {
  try {
    console.log('came to performActionOnTaskSaga with payload :: ', payload);
    const { jobStatus, entityId } = yield select(
      (state: RootState) => state.composer,
    );

    const isJobStarted = jobStatus === JobStatus.INPROGRESS;

    const { taskId } = payload;

    if (isJobStarted) {
      console.log('make api call to start the task with taskId :: ', taskId);

      const { data } = yield call(
        request,
        'PUT',
        apiPerformActionOnTask(taskId, payload.action),
        { data: { id: entityId } },
      );

      console.log('data from start task api call :: ', data);

      yield put(updateTaskExecutionStatus(taskId, data));
    } else {
      console.log('open modal to start the job');
      yield put(
        openModalAction({
          type: ModalNames.START_JOB_MODAL,
          props: { taskId, jobId: entityId },
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
  yield takeLatest(TaskListAction.ADD_NEW_TASK, addNewTaskSaga);
  yield takeLatest(TaskListAction.START_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.COMPLETE_TASK, performActionOnTaskSaga);
  yield takeLatest(TaskListAction.SKIP_TASK, performActionOnTaskSaga);
}
