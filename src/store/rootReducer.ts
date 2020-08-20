import { ModalContainerReducer } from '#components/ModalContainer/reducer';
import { ChecklistListViewReducer } from '#views/Checklists/ListView/reducer';
import { ChecklistReducer } from '#views/Checklists/reducer';
import { AuthReducer } from '#views/Auth/reducer';
import { JobListViewReducer } from '#views/Jobs/ListView/reducer';
import { combineReducers } from 'redux';

import { PropertiesReducer } from './properties/reducer';
import { UsersReducer } from './users/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklist: ChecklistReducer,
  jobListView: JobListViewReducer,
  modalContainer: ModalContainerReducer,
  properties: PropertiesReducer,
  users: UsersReducer,
  auth: AuthReducer,
});
