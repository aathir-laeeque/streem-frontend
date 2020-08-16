import { RootState } from '#store/types';
import { select, takeLatest, put } from 'redux-saga/effects';

import { setActiveStage } from './stageListView.action';
import { StageListViewAction, StageListViewState } from './stageListView.types';
import { setTasks } from './taskListView.action';

function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
  // console.log('payload from setTasksSaga  ::', payload);

  try {
    const { activeStage: { tasks } = {} }: StageListViewState = yield select(
      (state: RootState) => state.newComposer.stages,
    );

    console.log(
      'Tasks from TaskListViewSaga => setTasksSaga ::::::====> ',
      tasks,
    );

    yield put(setTasks(tasks));
  } catch (error) {
    console.log('error from setTasksSaga :: ', error);
  }
}

export function* TaskListViewSaga() {
  yield takeLatest(StageListViewAction.SET_ACTIVE_STAGE, setTasksSaga);
}
