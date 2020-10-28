import { actionSpreader } from '#store';

import { Activity } from '../checklist.types';
import { ActivityListAction } from './reducer.types';
import { SupervisorResponse, approveRejectActivityArgs } from './types';

export const executeActivity = (activity: Activity, reason?: string) =>
  actionSpreader(ActivityListAction.EXECUTE_ACTIVITY, { activity, reason });

export const fixActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.FIX_ACTIVITY, { activity });

export const updateExecutedActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.UPDATE_EXECUTED_ACTIVITY, { activity });

export const setActivityError = (error: any, activityId: Activity['id']) =>
  actionSpreader(ActivityListAction.SET_ACTIVITY_ERROR, { error, activityId });

export const approveRejectActivity = ({
  activityId,
  jobId,
  type,
}: approveRejectActivityArgs) =>
  actionSpreader(
    type === SupervisorResponse.APPROVE
      ? ActivityListAction.APPROVE_ACTIVITY
      : ActivityListAction.REJECT_ACTIVITY,
    { activityId, jobId, type },
  );
