import { Reducer } from 'redux';

import {
  PropertiesAction,
  PropertiesActionType,
  PropertiesState,
  PropertyById,
} from './types';

const initialState: PropertiesState = {
  checklist: {
    list: [],
    listById: {},
  },
  job: {
    list: [],
    listById: {},
  },
  loading: false,
};

const reducer: Reducer<PropertiesState, PropertiesActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case PropertiesAction.FETCH_PROPERTIES_ONGOING:
      return { ...state, loading: true };

    case PropertiesAction.FETCH_PROPERTIES_ERROR:
      return { ...state, error: action.payload.error };

    case PropertiesAction.FETCH_PROPERTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        [action.payload.entity]: {
          list: action.payload.data,
          listById: action.payload.data.reduce<PropertyById>((acc, el) => {
            acc[el.id.toString()] = el;

            return acc;
          }, {}),
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as PropertiesServiceReducer };
