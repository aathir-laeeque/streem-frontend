import {
  PropertiesAction,
  PropertiesActionType,
  PropertiesState,
} from './types';

const initialState: PropertiesState = {
  job: [],
  checklist: [],
};

const reducer = (
  state = initialState,
  action: PropertiesActionType,
): PropertiesState => {
  switch (action.type) {
    case PropertiesAction.FETCH_PROPERTIES_SUCCESS:
      if (action.payload?.type === 'JOB') {
        return {
          ...state,
          job: action.payload?.properties,
        };
      } else {
        return {
          ...state,
          checklist: action.payload?.properties,
        };
      }
    case PropertiesAction.FETCH_PROPERTIES_ERROR:
      return { ...state, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as PropertiesReducer };
