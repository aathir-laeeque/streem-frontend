import { combineReducers } from 'redux';

import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
});
