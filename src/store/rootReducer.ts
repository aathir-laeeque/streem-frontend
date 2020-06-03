import { combineReducers } from 'redux';

import { CounterReducer } from '../components/Counter/reducer';

export const rootReducer = combineReducers({
  counter: CounterReducer,
});
