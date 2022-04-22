import { ComposerActionType } from '../composer.reducer.types';
import {
  executeActivity,
  fixActivity,
  executeActivityLeading,
  fixActivityLeading,
  removeActivityError,
  setActivityError,
  updateExecutedActivity,
  updateMediaActivitySuccess,
} from './actions';
import { ActivitiesById, ActivitiesOrderInTaskInStage } from './types';

export type ActivityListState = {
  activitiesById: ActivitiesById;
  activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage;
};

export enum ActivityListAction {
  EXECUTE_ACTIVITY_LATEST = '@@jobComposer/activity-list/activity/EXECUTE_ACTIVITY_LATEST',
  UPDATE_EXECUTED_ACTIVITY = '@@jobComposer/activity-list/activity/UPDATE_EXECUTED_ACTIVITY',
  SET_ACTIVITY_ERROR = '@@jobComposer/activity-list/activity/SET_ACTIVITY_ERROR',
  REMOVE_ACTIVITY_ERROR = '@@jobComposer/activity-list/activity/REMOVE_ACTIVITY_ERROR',

  FIX_ACTIVITY_LATEST = '@@jobComposer/activity-list/activity/FIX_ACTIVITY_LATEST',
  APPROVE_ACTIVITY = '@@jobComposer/activity-list/activity/APPROVE_ACTIVITY',
  REJECT_ACTIVITY = '@@jobComposer/activity-list/activity/REJECT_ACTIVITY',

  UPDATE_MEDIA_ACTIVITY_SUCCESS = '@@jobComposer/activity-list/activity/UPDATE_MEDIA_ACTIVITY_SUCCESS',

  EXECUTE_ACTIVITY_LEADING = '@@jobComposer/activity-list/activity/EXECUTE_ACTIVITY_LEADING',
  FIX_ACTIVITY_LEADING = '@@jobComposer/activity-list/activity/FIX_ACTIVITY_LEADING',
}

export type ActivityListActionType =
  | ReturnType<
      | typeof executeActivity
      | typeof fixActivity
      | typeof setActivityError
      | typeof updateExecutedActivity
      | typeof removeActivityError
      | typeof updateMediaActivitySuccess
      | typeof executeActivityLeading
      | typeof fixActivityLeading
    >
  | ComposerActionType;
