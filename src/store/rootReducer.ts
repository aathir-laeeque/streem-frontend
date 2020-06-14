import { combineReducers } from 'redux';

import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';
import { ChecklistComposerReducer } from '../views/Checklists/ChecklistComposer/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: ChecklistComposerReducer,
});
