import { showNotificationSaga } from '#components/Notification/saga';
import { ChecklistListViewSaga } from '#views/Checklists/ListView/saga';
import { JobListViewSaga } from '#views/Jobs/ListView/saga';
import { all, fork } from 'redux-saga/effects';

import { ComposerSaga } from '../views/Checklists/ChecklistComposer/saga';
import { PropertiesSaga } from './properties/saga';
import { UsersSaga } from './users/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),

    fork(PropertiesSaga),
    fork(showNotificationSaga),
    fork(JobListViewSaga),
    fork(UsersSaga),
    fork(ComposerSaga),
  ]);
}
