import { combineReducers } from 'redux';

import { ChecklistListViewReducer } from '../views/NewChecklists/ListView/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
});
