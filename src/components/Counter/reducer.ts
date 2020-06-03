import { CounterAction, CounterActionTypes, CounterState } from './types';

const initialState: CounterState = {
  count: 0,
};

const reducer = (state = initialState, action: CounterAction): CounterState => {
  switch (action.type) {
    case CounterActionTypes.INCREMENT:
      return { ...state, count: state.count + 1 };

    case CounterActionTypes.DECREMENT:
      return { ...state, count: state.count - 1 };

    case CounterActionTypes.RESET:
      return { ...state, count: 0 };

    default:
      return { ...initialState };
  }
};

export { reducer as CounterReducer };
