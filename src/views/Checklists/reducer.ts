import { combineReducers } from 'redux';

import { composerReducer } from './ChecklistComposer/reducer';

export const ChecklistReducer = combineReducers({
  composer: composerReducer,
});
