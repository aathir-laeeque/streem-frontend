import { ModalContainerReducer } from '#components/ModalContainer/reducer';
import { ChecklistListViewReducer } from '#views/Checklists/ListView/reducer';
import { AuthReducer } from '#views/Auth/reducer';
import { JobListViewReducer } from '#views/Jobs/ListView/reducer';
import { InboxListViewReducer } from '#views/Inbox/ListView/reducer';
import { combineReducers } from 'redux';

import { PropertiesReducer } from './properties/reducer';
import { UsersReducer } from './users/reducer';
import { FacilitiesReducer } from './facilities/reducer';
import { SessionActivityReducer } from '#views/UserAccess/ListView/SessionActivity/reducer';
// import { newComposerReducer } from '#views/Checklists/NewComposer/composer.reducer';
import { ComposerReducer } from '../Composer/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  jobListView: JobListViewReducer,
  inboxListView: InboxListViewReducer,
  modalContainer: ModalContainerReducer,
  properties: PropertiesReducer,
  users: UsersReducer,
  facilities: FacilitiesReducer,
  auth: AuthReducer,
  sessionActivity: SessionActivityReducer,

  // newComposer: newComposerReducer,
  composer: ComposerReducer,
});
