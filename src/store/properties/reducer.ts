import { Reducer } from 'redux';

import {
  PropertiesAction,
  PropertiesActionType,
  PropertiesState,
} from './types';

const initialState: PropertiesState = {
  checklist: [],
  job: [],
  loading: false,
};

const reducer: Reducer<PropertiesState, PropertiesActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case PropertiesAction.FETCH_PROPERTIES_ONGOING:
      return {
        ...state,
        loading: true,
      };

    case PropertiesAction.FETCH_PROPERTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        [action.payload.type]: action.payload.data,
      };

    case PropertiesAction.FETCH_PROPERTIES_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return { ...state };
  }
};

export { reducer as PropertiesReducer };
