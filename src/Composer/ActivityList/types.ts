import { Activity } from '../checklist.types';
import { updateExecutedActivity } from './actions';

export type ActivityListProps = {
  activities: Activity[];
  isTaskStarted: boolean;
};

export type ActivityProps = {
  activity: Activity;
};

export enum Selections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export enum ActivityListAction {
  EXECUTE_ACTIVITY = '@@composer/activity-list/activity/EXECUTE_ACTIVITY',
  UPDATE_EXECUTE_ACTIVITY = '@@composer/activity-list/activity/UPDATE_EXECUTE_ACTIVITY',
  SET_ACTIVITY_ERROR = '@@composer/activity-list/activity/SET_ACTIVITY_ERROR',
}

export type ActivityListActionType = ReturnType<typeof updateExecutedActivity>;

export enum ActivityErrors {
  E401 = 'ACTIVITY_INCOMPLETE',
}
