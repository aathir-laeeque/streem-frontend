/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import all sagas and pass them in the array
import { all, fork } from 'redux-saga/effects';

import { ChecklistListViewSaga } from '../views/Checklists/ListView/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),
  ]);
}
