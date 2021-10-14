import { OverlayContainerReducer } from '#components/OverlayContainer/reducer';
import { ComposerReducer } from '#JobComposer/reducer';
import { ComposerReducer as prototypeComposer } from '#PrototypeComposer/reducer';
import { AuthReducer } from '#views/Auth/reducer';
import { ChecklistListViewReducer } from '#views/Checklists/ListView/reducer';
import { InboxListViewReducer } from '#views/Inbox/ListView/reducer';
import { SessionActivityReducer } from '#views/UserAccess/ListView/SessionActivity/reducer';
import { combineReducers } from 'redux';

import { PropertiesServiceReducer } from '../services/properties/reducer';
import { UsersServiceReducer } from '../services/users/reducer';
import { NewJobListViewReducer } from '../views/Jobs/NewListView/reducer';
import { ActivityFiltersReducer } from './activity-filters/reducer';
import { FacilitiesReducer } from './facilities/reducer';
import { FileUploadReducer } from './file-upload/reducer';
import { PropertiesReducer } from './properties/reducer';
import { UsersReducer } from './users/reducer';
import { ExtrasReducer } from './extras/reducer';

export const rootReducer = combineReducers({
  auth: AuthReducer,
  checklistListView: ChecklistListViewReducer,
  composer: ComposerReducer,
  facilities: FacilitiesReducer,
  fileUpload: FileUploadReducer,
  inboxListView: InboxListViewReducer,
  overlayContainer: OverlayContainerReducer,
  properties: PropertiesReducer,
  prototypeComposer,
  sessionActivity: SessionActivityReducer,
  users: UsersReducer,
  extras: ExtrasReducer,
  propertiesService: PropertiesServiceReducer,
  usersService: UsersServiceReducer,
  activityFilters: ActivityFiltersReducer,
  jobListView: NewJobListViewReducer,
});
