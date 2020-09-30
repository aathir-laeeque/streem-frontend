import { actionSpreader } from '#store/helpers';

import { Activity } from '../checklist.types';
import { ActivityListActions } from './reducer.types';
import { AddNewActivityArgs, DeleteActivityArgs } from './types';

export const updateActivity = (activity: Activity) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY, { activity });

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
