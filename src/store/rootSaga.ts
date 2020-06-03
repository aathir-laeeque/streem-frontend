/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import all sagas and pass them in the array
import { all } from 'redux-saga/effects';

export function* rootSaga() {
  yield all([
    // fork all sagas here
  ]);
}
