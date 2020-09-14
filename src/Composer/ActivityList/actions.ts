import { actionSpreader } from '#store';

import { Activity } from '../checklist.types';
import { ActivityListAction } from './reducer.types';

export const executeActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.EXECUTE_ACTIVITY, { activity });

export const fixActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.FIX_ACTIVITY, { activity });

export const updateExecutedActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.UPDATE_EXECUTED_ACTIVITY, { activity });

export const setActivityError = (error: any, activityId: Activity['id']) =>
  actionSpreader(ActivityListAction.SET_ACTIVITY_ERROR, { error, activityId });
