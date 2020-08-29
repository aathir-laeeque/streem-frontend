import { RootState } from '#store';
import { select, takeLatest, put } from 'redux-saga/effects';

import { setActiveStage } from '../StageList/actions';
import { StageListAction } from '../StageList/types';
import { addNewTask, setTasksList } from './actions';
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

export function* TaskListSaga() {
  yield takeLatest(StageListAction.SET_ACTIVE_STAGE, setTasksSaga);
  yield takeLatest(TaskListAction.ADD_NEW_TASK, addNewTaskSaga);
}
