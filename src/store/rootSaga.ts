/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import all sagas and pass them in the array
import { all, fork } from 'redux-saga/effects';

import checklistSaga from '../views/Checklists/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(checklistSaga),
  ]);
}
