/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import all sagas and pass them in the array
import { showNotificationSaga } from '#components/Notification/saga';
import { ChecklistComposerSaga } from '#views/Checklists/ChecklistComposer/saga';
import { StageListSaga } from '#views/Checklists/ChecklistComposer/StageList/saga';
import { IntearctionViewSaga } from '#views/Checklists/ChecklistComposer/StepsList/StepView/InteractionView/saga';
import { StepViewSaga } from '#views/Checklists/ChecklistComposer/StepsList/StepView/saga';
import { ChecklistListViewSaga } from '#views/Checklists/ListView/saga';
import { JobListViewSaga } from '#views/Jobs/ListView/saga';
import { all, fork } from 'redux-saga/effects';

import { PropertiesSaga } from './properties/saga';
import { UsersSaga } from './users/saga';

// TODO: move this saga import to checklistcomposer saga
export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),
    fork(ChecklistComposerSaga),

    fork(StageListSaga),
    fork(StepViewSaga),
    fork(IntearctionViewSaga),
    fork(PropertiesSaga),
    fork(showNotificationSaga),
    fork(JobListViewSaga),
    fork(UsersSaga),
  ]);
}
