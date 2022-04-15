import { ExtrasState, ExtrasAction, ExtrasActionType } from './types';

const initialState: ExtrasState = {
  connected: true,
  hasGlobalError: false,
};

const reducer = (
  state = initialState,
  action: ExtrasActionType,
): ExtrasState => {
  switch (action.type) {
    case ExtrasAction.SET_INTERNET_CONNECTIVITY:
      return { ...state, connected: action.payload.connected };

    case ExtrasAction.SET_GLOBAL_ERROR:
      return { ...state, hasGlobalError: action.payload.hasError };

    case ExtrasAction.SET_RECENT_SERVER_TIMESTAMP:
      return { ...state, recentServerTimestamp: action.payload.timestamp };
    default:
      return state;
  }
};

export { reducer as ExtrasReducer };
