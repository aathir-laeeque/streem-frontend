import { combineReducers } from 'redux';

// import { composerReducer } from '../views/Checklists/ChecklistComposer/reducer';
import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';

import { checklistReducer } from '#views/Checklists/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  // checklistComposer: composerReducer,

  checklist: checklistReducer,
});
