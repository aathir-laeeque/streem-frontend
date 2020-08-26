import { all, fork } from 'redux-saga/effects';

import { ActivitySaga } from './TaskView/ActivityListView/Activity/saga';

export function* TaskListViewSaga() {
  yield all([
    // fork activity saga
    fork(ActivitySaga),
  ]);
}
