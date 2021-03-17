import { ExtrasState, ExtrasAction, ExtrasActionType } from './types';

const initialState: ExtrasState = {
  connected: true,
};

const reducer = (
  state = initialState,
  action: ExtrasActionType,
): ExtrasState => {
  switch (action.type) {
    case ExtrasAction.SET_INTERNET_CONNECTIVITY:
      return { ...state, connected: action.payload.connected };

    default:
      return state;
  }
};

export { reducer as ExtrasReducer };
