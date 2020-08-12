import { setActiveStage } from './stageListView.action';
import { StageListViewAction } from './stageListView.types';
import { takeLatest } from 'redux-saga/effects';

function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
  console.log('payload from setTasksSaga  ::', payload);
}

export function* TaskListViewSaga() {
  yield takeLatest(StageListViewAction.SET_ACTIVE_STAGE, setTasksSaga);
}
