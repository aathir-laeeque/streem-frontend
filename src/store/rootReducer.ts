import { combineReducers } from 'redux';

// reducers from components
import { CounterReducer } from '../components/Counter/reducer';

// reducers from views
import { ChecklistReducer } from '../views/Checklists/reducer';

export const rootReducer = combineReducers({
  counter: CounterReducer,
  checklist: ChecklistReducer,
});
