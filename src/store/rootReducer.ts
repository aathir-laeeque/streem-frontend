import { ModalContainerReducer } from '#components/ModalContainer/reducer';
import { ChecklistComposerReducer } from '#views/Checklists/ChecklistComposer/reducer';
import { ChecklistListViewReducer } from '#views/Checklists/ListView/reducer';
import { TaskListViewReducer } from '#views/Tasks/ListView/reducer';
import { combineReducers } from 'redux';

import { PropertiesReducer } from './properties/reducer';
import { UsersReducer } from './users/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: ChecklistComposerReducer,
  properties: PropertiesReducer,
  users: UsersReducer,
  taskListView: TaskListViewReducer,
  modalContainer: ModalContainerReducer,
});
