import { actionSpreader } from '#store/helpers';
import { Error } from '#utils/globalTypes';

import { Activity } from '../checklist.types';
import { ActivityListActions } from './reducer.types';
import { AddNewActivityArgs, DeleteActivityArgs } from './types';

export const addNewActivity = (params: AddNewActivityArgs) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY, { ...params });

export const addNewActivityError = (error: any) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY_ERROR, { error });

export const addNewActivitySuccess = (
  params: Pick<AddNewActivityArgs, 'stageId' | 'taskId'> & {
    activity: Activity;
  },
) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY_SUCCESS, { ...params });

export const deleteActivity = (params: DeleteActivityArgs) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY, { ...params });

export const deleteActivityError = (error: any) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY_ERROR, { error });

export const deleteActivitySuccess = (params: DeleteActivityArgs) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY_SUCCESS, { ...params });

export const updateActivity = (activity: Activity) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY, { activity });

export const updateActivityError = (error: any) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY_ERROR, { error });

export const updateActivitySuccess = (activity: Activity) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY_SUCCESS, { activity });

export const setValidationError = (error: Error) =>
  actionSpreader(ActivityListActions.SET_VALIDATION_ERROR, { error });

export const resetValidationError = (activityId: Activity['id']) =>
  actionSpreader(ActivityListActions.RESET_VALIDATION_ERROR, { activityId });
