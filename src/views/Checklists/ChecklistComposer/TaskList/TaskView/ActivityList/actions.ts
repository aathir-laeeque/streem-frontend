import { actionSpreader } from '#store';

import { Activity } from './Activity/types';

import { ActivityById, ActivityListAction } from './types';

export const setTaskActivities = (
  activities: ActivityById,
  activeActivityId: Activity['id'],
) =>
  actionSpreader(ActivityListAction.SET_ACTIVITY_LIST, {
    activities,
    activeActivityId,
  });
