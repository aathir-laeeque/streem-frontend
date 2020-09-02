import { Activity } from '../checklist.types';
import { updateExecutedActivity } from './actions';

export type ActivityListProps = {
  activities: Activity[];
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
}

export type ActivityListActionType = ReturnType<typeof updateExecutedActivity>;
