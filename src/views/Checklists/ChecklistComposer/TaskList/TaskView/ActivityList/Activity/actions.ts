import { actionSpreader } from '#store';

import { Activity, ActivityAction } from './types';

export const setActiveActivity = (activityId: Activity['id']) =>
  actionSpreader(ActivityAction.SET_ACTIVE_ACTIVITY, { activityId });

export const updateActivity = (activity: Activity) =>
  actionSpreader(ActivityAction.UPDATE_ACTIVITY, { activity });

export const executeActivity = (activity: Activity) =>
  actionSpreader(ActivityAction.EXECUTE_ACTIVITY, { activity });
