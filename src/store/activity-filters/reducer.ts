import {
  ActivityFiltersState,
  ActivityFiltersActionType,
  ActivityFiltersAction,
} from './types';

const initialState: ActivityFiltersState = {
  filters: '',
};

const reducer = (
  state = initialState,
  action: ActivityFiltersActionType,
): ActivityFiltersState => {
  switch (action.type) {
    case ActivityFiltersAction.SET_FILTERS:
      return { ...state, filters: action.payload };

    case ActivityFiltersAction.CLEAR_FILTRES:
      return initialState;

    default:
      return state;
  }
};

export { reducer as ActivityFiltersReducer };
