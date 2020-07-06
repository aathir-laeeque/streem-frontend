import { actionSpreader } from '#store';
import { Activity } from './types';

import {
  ActivityAction,
  updateDataParams,
  updateActivityParams,
} from './types';

export const setActiveActivity = (activityId: Activity['id']) =>
  actionSpreader(ActivityAction.SET_ACTIVE_ACTIVITY, { activityId });

export const updateActivity = (activity: updateActivityParams) =>
  actionSpreader(ActivityAction.UPDATE_ACTIVITY, { activity });

export const updateActivityData = (activity: updateDataParams) =>
  actionSpreader(ActivityAction.UPDATE_ACTIVITY_DATA, { activity });
