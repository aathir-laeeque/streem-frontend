import { ExtrasState, ExtrasAction, ExtrasActionType } from './types';

const initialState: ExtrasState = {
  connected: true,
  hasGlobalError: false,
  isDrawerOpen: false,
};

const reducer = (state = initialState, action: ExtrasActionType): ExtrasState => {
  switch (action.type) {
    case ExtrasAction.SET_INTERNET_CONNECTIVITY:
      return { ...state, connected: action.payload.connected };

    case ExtrasAction.SET_GLOBAL_ERROR:
      return { ...state, hasGlobalError: action.payload.hasError };

    case ExtrasAction.SET_RECENT_SERVER_TIMESTAMP:
      return { ...state, recentServerTimestamp: action.payload.timestamp };

    case ExtrasAction.TOGGLE_IS_DRAWER_OPEN:
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    default:
      return state;
  }
};

export { reducer as ExtrasReducer };
