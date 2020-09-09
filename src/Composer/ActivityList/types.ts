import { Activity } from '../checklist.types';
import { fixActivity } from './actions';
import {
  setActivityError,
  updateExecutedActivity,
  executeActivity,
} from './actions';

export type ActivityListProps = {
  activities: Activity[];
  isTaskStarted: boolean;
};

export type ActivityProps = {
  activity: Activity;
  isCorrectingError: boolean;
};

export enum Selections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export enum ActivityListAction {
  EXECUTE_ACTIVITY = '@@composer/activity-list/activity/EXECUTE_ACTIVITY',
  UPDATE_EXECUTED_ACTIVITY = '@@composer/activity-list/activity/UPDATE_EXECUTED_ACTIVITY',
  SET_ACTIVITY_ERROR = '@@composer/activity-list/activity/SET_ACTIVITY_ERROR',
  FIX_ACTIVITY = '@@composer/activity-list/activity/FIX_ACTIVITY',
}

export type ActivityListActionType = ReturnType<
  | typeof updateExecutedActivity
  | typeof setActivityError
  | typeof executeActivity
  | typeof fixActivity
>;

export enum ActivityErrors {
  E401 = 'ACTIVITY_INCOMPLETE',
}
