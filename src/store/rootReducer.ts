import { combineReducers } from 'redux';

import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';
import { propertiesReducer } from './properties/reducer';
import { ChecklistComposerReducer } from '../views/Checklists/ChecklistComposer/reducer';
import { TaskListViewReducer } from '../views/Tasks/ListView/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: ChecklistComposerReducer,
  properties: propertiesReducer,
  taskListView: TaskListViewReducer,
});
