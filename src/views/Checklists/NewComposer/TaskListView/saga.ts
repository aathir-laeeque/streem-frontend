import { RootState } from '#store';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
  StageListViewAction,
  StageListViewState,
} from '../StageListView/types';
import { setTasks } from './actions';
import { ActivitySaga } from './TaskView/ActivityListView/Activity/saga';

function* setTasksSaga() {
  try {
    const {
      activeStage: { tasks },
    }: StageListViewState = yield select(
      (state: RootState) => state.newComposer.stages,
    );

    yield put(setTasks(tasks));
  } catch (error) {
    console.log('error from setTasksSaga :: ', error);
  }
}

export function* TaskListViewSaga() {
  yield takeLatest(StageListViewAction.SET_ACTIVE_STAGE, setTasksSaga);

  yield all([
    // fork activity saga
    fork(ActivitySaga),
  ]);
}
