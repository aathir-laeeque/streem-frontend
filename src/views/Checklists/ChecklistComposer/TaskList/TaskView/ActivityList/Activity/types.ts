import {
  updateActivityData,
  updateActivity,
  setActiveActivity,
} from './actions';

export enum ActivityType {
  MATERIAL = 'material',
  INSTRUCTION = 'instruction',
  YESNO = 'yes-no',
  CHECKLIST = 'checklist',
  SHOULDBE = 'should-be',
  MEDIA = 'media',
  MULTISELECT = 'multiselect',
  TEXTBOX = 'textbox',
  SIGNATURE = 'signature',
}

export interface Activity {
  id: number;
  type: ActivityType;
  // TODO: look into type for data in activity
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
}

export interface ActivityProps {
  activity: Activity;
}

export enum ActivityAction {
  SET_ACTIVE_ACTIVITY = '@@checklist/composer/activity/SET_ACTIVE_ACTIVITY',
  UPDATE_ACTIVITY = '@@checklist/composer/activity/UPDATE_ACTIVITY',
  UPDATE_ACTIVITY_DATA = '@@checklist/composer/activity/UPDATE_ACTIVITY_DATA',
}

export type ActivityActionType = ReturnType<
  typeof updateActivityData | typeof updateActivity | typeof setActiveActivity
>;

export type updateDataParams = Pick<Activity, 'data' | 'id'>;

export type updateActivityParams = Pick<Activity, 'id' | 'label'>;
