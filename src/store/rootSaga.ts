import { showNotificationSaga } from '#components/Notification/saga';
import { ChecklistListViewSaga } from '#views/Checklists/ListView/saga';
import { AuthSaga } from '#views/Auth/saga';
import { UserAccessSaga } from '#views/UserAccess/saga';
import { JobListViewSaga } from '#views/Jobs/ListView/saga';
import { all, fork } from 'redux-saga/effects';

import { PropertiesSaga } from './properties/saga';
import { UsersSaga } from './users/saga';
import { FacilitiesSaga } from './facilities/saga';

// import { NewComposerSaga } from '#views/Checklists/NewComposer/composer.saga';

import { ComposerSaga } from '../Composer/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),
    fork(AuthSaga),
    fork(PropertiesSaga),
    fork(showNotificationSaga),
    fork(JobListViewSaga),
    fork(UsersSaga),
    fork(FacilitiesSaga),
    fork(UserAccessSaga),

    // fork(NewComposerSaga),
    fork(ComposerSaga),
  ]);
}
