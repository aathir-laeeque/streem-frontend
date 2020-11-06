import { showNotificationSaga } from '#components/Notification/saga';
import { ComposerSaga as prototypeComposerSaga } from '#Composer-new/saga';
import { AuthSaga } from '#views/Auth/saga';
import { ChecklistListViewSaga } from '#views/Checklists/ListView/saga';
import { NewPrototypeSaga } from '#views/Checklists/NewPrototype/saga';
import { InboxListViewSaga } from '#views/Inbox/ListView/saga';
import { JobListViewSaga } from '#views/Jobs/ListView/saga';
import { SessionActivitySaga } from '#views/UserAccess/ListView/SessionActivity/saga';
import { UserAccessSaga } from '#views/UserAccess/saga';
import { all, fork } from 'redux-saga/effects';

import { ComposerSaga } from '../Composer/saga';
import { FileUploadSaga } from '../modules/file-upload/saga';
import { PropertiesServiceSaga } from '../services/properties/saga';
import { UsersServiceSaga } from '../services/users/saga';
import { FacilitiesSaga } from './facilities/saga';
import { FileUploadSagaNew } from './file-upload/saga';
import { PropertiesSaga } from './properties/saga';
import { UsersSaga } from './users/saga';

import { NewJobListViewSaga } from '../views/Jobs/NewListView/saga';

export function* rootSaga() {
  yield all([
    // fork all sagas here
    fork(ChecklistListViewSaga),
    fork(AuthSaga),
    fork(PropertiesSaga),
    fork(showNotificationSaga),
    fork(JobListViewSaga),
    fork(InboxListViewSaga),
    fork(UsersSaga),
    fork(FacilitiesSaga),
    fork(UserAccessSaga),
    fork(FileUploadSaga),
    fork(SessionActivitySaga),

    fork(ComposerSaga),

    fork(prototypeComposerSaga),
    fork(NewPrototypeSaga),
    fork(FileUploadSagaNew),

    fork(PropertiesServiceSaga),
    fork(UsersServiceSaga),

    fork(NewJobListViewSaga),
  ]);
}
