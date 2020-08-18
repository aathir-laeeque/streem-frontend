import { actionSpreader } from '#store';

import { ActivityListActions } from './types';

export const setActiveActivity = (activityId) =>
  actionSpreader(ActivityListActions.SET_ACTIVE_ACTIVITY, { activityId });
