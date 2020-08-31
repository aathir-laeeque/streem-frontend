import { RootState } from '#store';
import { put, select, takeLatest } from 'redux-saga/effects';

import { setActiveStage } from '../StageList/actions';
import { StageListAction } from '../StageList/types';
import { JobStatus } from '../types';
import { addNewTask, setTasksList, startTask } from './actions';
import { TaskListAction } from './types';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';

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

function* startTaskSaga({ payload }: ReturnType<typeof startTask>) {
  try {
    console.log('came to startTaskSaga with payload :: ', payload);
    const { jobStatus, entityId } = yield select(
      (state: RootState) => state.composer,
    );

    const isJobStarted = jobStatus === JobStatus.INPROGRESS;

    const { taskId } = payload;

    if (isJobStarted) {
      console.log('make api call to start the task with taskId :: ', taskId);
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
    console.error('error came in startTaskSaga in TaskListSaga :: ', error);
  }
}

export function* TaskListSaga() {
  yield takeLatest(StageListAction.SET_ACTIVE_STAGE, setTasksSaga);
  yield takeLatest(TaskListAction.ADD_NEW_TASK, addNewTaskSaga);
  yield takeLatest(TaskListAction.START_TASK, startTaskSaga);
}
