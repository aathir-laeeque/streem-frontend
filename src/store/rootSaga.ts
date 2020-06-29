import { all, fork } from 'redux-saga/effects';

import { ComposerSaga } from '../views/Checklists/ChecklistComposer/saga';
import { ChecklistListViewSaga } from '../views/Checklists/ListView/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),

    fork(ComposerSaga),
  ]);
}
