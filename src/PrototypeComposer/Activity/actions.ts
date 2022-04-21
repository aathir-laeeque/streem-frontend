import { Activity } from './../checklist.types';
import { actionSpreader } from '#store/helpers';
import { Error } from '#utils/globalTypes';
import {
  ActivityListActions,
  ActivityOrderInTaskInStage,
} from './reducer.types';
import { AddNewActivityType, DeleteActivityType } from './types';

export const addNewActivity = (params: AddNewActivityType) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY, { ...params });

export const addNewActivityError = (error: any) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY_ERROR, { error });

export const addNewActivitySuccess = (
  params: Pick<AddNewActivityType, 'stageId' | 'taskId'> & {
    activity: Activity;
  },
) =>
  actionSpreader(ActivityListActions.ADD_NEW_ACTIVITY_SUCCESS, { ...params });

export const deleteActivity = (params: DeleteActivityType) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY, { ...params });

export const deleteActivityError = (error: any) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY_ERROR, { error });

export const deleteActivitySuccess = (params: DeleteActivityType) =>
  actionSpreader(ActivityListActions.DELETE_ACTIVITY_SUCCESS, { ...params });

export const updateActivityApi = (activity: Activity) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY_API, { activity });

export const updateStoreActivity = (
  data: Activity['data'],
  activityId: Activity['id'],
  updatePath: (string | number)[],
) =>
  actionSpreader(ActivityListActions.UPDATE_STORE_ACTIVITY, {
    updatePath,
    activityId,
    data,
  });

export const updateStoreMediaActivity = (
  activityId: Activity['id'],
  dataIndex: number,
  data: Activity['data'],
) =>
  actionSpreader(ActivityListActions.UPDATE_STORE_MEDIA_ACTIVITY, {
    activityId,
    dataIndex,
    data,
  });

export const removeStoreActivityItem = (
  activityId: Activity['id'],
  activityItemId: string,
) =>
  actionSpreader(ActivityListActions.REMOVE_STORE_ACTIVITY_ITEM, {
    activityId,
    activityItemId,
  });

export const addStoreActivityItem = (
  activityId: Activity['id'],
  activityItemData: Activity['data'],
) =>
  actionSpreader(ActivityListActions.ADD_STORE_ACTIVITY_ITEM, {
    activityId,
    activityItemData,
  });

export const updateActivityError = (error: any) =>
  actionSpreader(ActivityListActions.UPDATE_ACTIVITY_ERROR, { error });

export const setValidationError = (error: Error) =>
  actionSpreader(ActivityListActions.SET_VALIDATION_ERROR, { error });
