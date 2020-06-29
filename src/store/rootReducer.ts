import { ModalContainerReducer } from '#components/ModalContainer/reducer';
import { ChecklistComposerReducer } from '#views/Checklists/ChecklistComposer/reducer';
import { ChecklistListViewReducer } from '#views/Checklists/ListView/reducer';
import { TaskListViewReducer } from '#views/Tasks/ListView/reducer';
import { combineReducers } from 'redux';

import { propertiesReducer } from './properties/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: ChecklistComposerReducer,
  properties: propertiesReducer,
  taskListView: TaskListViewReducer,
  ModalContainer: ModalContainerReducer,
});
