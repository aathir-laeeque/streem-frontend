import { actionSpreader } from '#store';

import { Activity } from '../checklist.types';
import { ActivityListAction } from './types';

export const executeActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.EXECUTE_ACTIVITY, { activity });

export const updateExecutedActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.UPDATE_EXECUTE_ACTIVITY, { activity });
