import { ComposerActionType } from './../../../types';
import { setTaskActivities } from './actions';
import { Activity, ActivityActionType } from './Activity/types';

export interface ActivityListProps {
  activitiesId: Activity['id'][];
}

export type ActivityById = Record<Activity['id'], Activity>;

export interface ActivityListState {
  list: ActivityById;
  activeActivityId?: Activity['id'];
}

export enum ActivityListAction {
  SET_ACTIVITY_LIST = '@@checklsit/composer/activity_list/SET_ACTIVITY_LIST',
}

export type ActivityListActionType =
  | ReturnType<typeof setTaskActivities>
  | ActivityActionType
  | ComposerActionType;
