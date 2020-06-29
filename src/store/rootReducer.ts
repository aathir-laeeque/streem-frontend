import { combineReducers } from 'redux';

import { composerReducer } from '../views/Checklists/ChecklistComposer/reducer';
import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: composerReducer,
});
