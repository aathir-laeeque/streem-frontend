import { all, fork, takeLatest } from 'redux-saga/effects';

import { updateTask } from './actions';
import { ActivityListSaga } from './ActivityList/saga';
import { TaskViewAction } from './types';

function* updateTaskSaga({ payload }: ReturnType<typeof updateTask>) {
  console.log('payload from updateTaskSaga :: ', payload);
}

export function* TaskViewSaga() {
  yield takeLatest(TaskViewAction.UPDATE_TASK, updateTaskSaga);

  yield all([fork(ActivityListSaga)]);
}
