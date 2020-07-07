import { combineReducers } from 'redux';

import { composerReducer } from './ChecklistComposer/reducer';

export const checklistReducer = combineReducers({
  composer: composerReducer,
});
