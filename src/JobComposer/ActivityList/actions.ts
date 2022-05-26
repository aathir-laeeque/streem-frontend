import { actionSpreader } from '#store';
import { Activity, Media } from '../checklist.types';
import { ActivityListAction } from './reducer.types';
import { SupervisorResponse, approveRejectActivityType } from './types';

export const executeActivity = (activity: Activity, reason?: string) =>
  actionSpreader(ActivityListAction.EXECUTE_ACTIVITY_LATEST, {
    activity,
    reason,
  });

export const fixActivity = (activity: Activity, reason?: string) =>
  actionSpreader(ActivityListAction.FIX_ACTIVITY_LATEST, { activity, reason });

export const executeActivityLeading = (activity: Activity, reason?: string) =>
  actionSpreader(ActivityListAction.EXECUTE_ACTIVITY_LEADING, {
    activity,
    reason,
  });

export const fixActivityLeading = (activity: Activity, reason?: string) =>
  actionSpreader(ActivityListAction.FIX_ACTIVITY_LEADING, { activity, reason });

export const updateExecutedActivity = (activity: Activity) =>
  actionSpreader(ActivityListAction.UPDATE_EXECUTED_ACTIVITY, {
    activity,
  });

export const updateMediaActivitySuccess = (
  media: Media,
  activityId: Activity['id'],
) =>
  actionSpreader(ActivityListAction.UPDATE_MEDIA_ACTIVITY_SUCCESS, {
    media,
    activityId,
  });

export const setActivityError = (error: any, activityId: Activity['id']) =>
  actionSpreader(ActivityListAction.SET_ACTIVITY_ERROR, { error, activityId });

export const removeActivityError = (activityId: Activity['id']) =>
  actionSpreader(ActivityListAction.REMOVE_ACTIVITY_ERROR, { activityId });

export const approveRejectActivity = ({
  activityId,
  jobId,
  type,
}: approveRejectActivityType) =>
  actionSpreader(
    type === SupervisorResponse.APPROVE
      ? ActivityListAction.APPROVE_ACTIVITY
      : ActivityListAction.REJECT_ACTIVITY,
    { activityId, jobId, type },
  );
