import { ComposerActionType } from '../composer.reducer.types';
import {
  executeActivity,
  fixActivity,
  setActivityError,
  updateExecutedActivity,
} from './actions';
import { ActivitiesById, ActivitiesOrderInTaskInStage } from './types';

export type ActivityListState = {
  activitiesById: ActivitiesById;
  activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage;
};

export enum ActivityListAction {
  EXECUTE_ACTIVITY = '@@composer/activity-list/activity/EXECUTE_ACTIVITY',
  UPDATE_EXECUTED_ACTIVITY = '@@composer/activity-list/activity/UPDATE_EXECUTED_ACTIVITY',
  SET_ACTIVITY_ERROR = '@@composer/activity-list/activity/SET_ACTIVITY_ERROR',
  FIX_ACTIVITY = '@@composer/activity-list/activity/FIX_ACTIVITY',
}

export type ActivityListActionType =
  | ReturnType<
      | typeof executeActivity
      | typeof fixActivity
      | typeof setActivityError
      | typeof updateExecutedActivity
    >
  | ComposerActionType;
