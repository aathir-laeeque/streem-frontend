import { Reducer } from 'redux';

import {
  ActivityListState,
  ActivityListActionType,
  ActivityListAction,
} from './types';
import { ActivityAction } from './Activity/types';

export const initialState: ActivityListState = {
  list: {},
  activeActivityId: undefined,
};

const reducer: Reducer<ActivityListState, ActivityListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ActivityListAction.SET_ACTIVITY_LIST:
      return {
        ...state,
        list: action.payload.activities,
        activeActivityId: action.payload.activeActivityId,
      };

    case ActivityAction.SET_ACTIVE_ACTIVITY:
      return { ...state, activeActivityId: action.payload.activityId };

    case ActivityAction.UPDATE_ACTIVITY:
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.activity.id]: {
            ...state.list[action.payload.activity.id],
            ...action.payload.activity,
          },
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as activityListReducer };
