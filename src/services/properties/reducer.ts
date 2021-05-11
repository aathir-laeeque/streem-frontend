import { Reducer } from 'redux';

import {
  PropertiesAction,
  PropertiesActionType,
  PropertiesState,
  PropertyById,
  PropertyByName,
} from './types';

const initialState: PropertiesState = {
  checklist: {
    list: [],
    listById: {},
    listByName: {},
  },
  job: {
    list: [],
    listById: {},
    listByName: {},
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
          listById: action.payload.data.reduce<PropertyById>(
            (acc, el) => ({ ...acc, [el.id.toString()]: el }),
            {},
          ),
          listByName: action.payload.data.reduce<PropertyByName>(
            (acc, el) => ({ ...acc, [el.name]: el }),
            {},
          ),
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as PropertiesServiceReducer };
