import { all, fork } from 'redux-saga/effects';

import { ActivitySaga } from './Activity/saga';

export function* ActivityListSaga() {
  yield all([fork(ActivitySaga)]);
}
