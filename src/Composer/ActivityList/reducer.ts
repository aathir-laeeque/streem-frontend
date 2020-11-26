import { getActivities } from '#Composer/utils';
import { Reducer } from 'redux';

import { ComposerAction } from '../composer.reducer.types';
import {
  ActivityListActionType,
  ActivityListState,
  ActivityListAction,
} from './reducer.types';
import { Entity } from '../composer.types';

export const initialState: ActivityListState = {
  activitiesById: {},
  activitiesOrderInTaskInStage: {},
};

const reducer: Reducer<ActivityListState, ActivityListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getActivities({ checklist }),
      };

    case ActivityListAction.UPDATE_EXECUTED_ACTIVITY:
      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [action.payload.activity.id]: { ...action.payload.activity },
        },
      };

    case ActivityListAction.SET_ACTIVITY_ERROR:
      const { activityId, error } = action.payload;

      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [activityId]: {
            ...state.activitiesById[activityId],
            hasError: true,
            errorMessage: error.message,
          },
        },
      };

    case ActivityListAction.REMOVE_ACTIVITY_ERROR:
      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [action.payload.activityId]: {
            ...state.activitiesById[action.payload.activityId],
            hasError: false,
            errorMessage: '',
          },
        },
      };

    case ActivityListAction.EXECUTE_ACTIVITY:
    case ActivityListAction.FIX_ACTIVITY:
      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [action.payload.activity.id]: {
            ...state.activitiesById[action.payload.activity.id],
            hasError: false,
            errorMessage: undefined,
          },
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as activityListReducer };
