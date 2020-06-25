/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import all sagas and pass them in the array
import { all, fork } from 'redux-saga/effects';

import { IntearctionViewSaga } from '../views/Checklists/ChecklistComposer/StepsList/StepView/InteractionView/saga';
import { StepViewSaga } from '../views/Checklists/ChecklistComposer/StepsList/StepView/saga';
import { ChecklistComposerSaga } from '../views/Checklists/ChecklistComposer/saga';
import { StageListSaga } from '../views/Checklists/ChecklistComposer/StageList/saga';
import { ChecklistListViewSaga } from '../views/Checklists/ListView/saga';

// TODO: move this saga import to checklistcomposer saga
export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),
    fork(ChecklistComposerSaga),

    fork(StageListSaga),
    fork(StepViewSaga),
    fork(IntearctionViewSaga),
  ]);
}
