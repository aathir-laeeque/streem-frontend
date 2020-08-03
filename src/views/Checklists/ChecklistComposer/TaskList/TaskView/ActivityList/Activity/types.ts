import { updateActivity, setActiveActivity } from './actions';

export enum ActivityType {
  MATERIAL = 'MATERIAL',
  INSTRUCTION = 'INSTRUCTION',
  YESNO = 'YES_NO',
  CHECKLIST = 'CHECKLIST',
  SHOULDBE = 'SHOULD_BE',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  TEXTBOX = 'TEXTBOX',
  SIGNATURE = 'SIGNATURE',
}

export interface Activity {
  id: number;
  type: ActivityType;
  // TODO: look into type for data in activity
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
  response?: any;
}

export interface ActivityProps {
  activity: Activity;
}

export enum ActivityAction {
  SET_ACTIVE_ACTIVITY = '@@composer/activity/SET_ACTIVE_ACTIVITY',
  UPDATE_ACTIVITY = '@@composer/activity/UPDATE_ACTIVITY',
  EXECUTE_ACTIVITY = '@@composer/activity/EXECUTE_ACTIVITY',
}

export type ActivityActionType = ReturnType<
  typeof updateActivity | typeof setActiveActivity
>;
