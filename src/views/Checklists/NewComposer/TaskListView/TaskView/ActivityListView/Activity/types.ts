import { Activity } from '../../../../checklist.types';

export interface ActivityProps {
  activityIndex: number;
  taskIndex: number;
  activity: any;
}

export enum ActivityActions {
  EXECUTE = '@composer/activity/EXECUTE',
  UPDATE = '@composer/activity/UPDATE',
}
export enum ActivitySelections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export type ExecuteActivityArguments = Activity;

export interface UpdateActivityArguments {
  activity: Partial<Activity>;
  activityIndex: number;
  taskIndex: number;
}
