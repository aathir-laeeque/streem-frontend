import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { ChecklistListViewReducer } from '../views/Checklists/ListView/reducer';
import { ChecklistComposerReducer } from '../views/Checklists/ChecklistComposer/reducer';

export const rootReducer = combineReducers({
  checklistListView: ChecklistListViewReducer,
  checklistComposer: ChecklistComposerReducer,

  form: formReducer,
});
