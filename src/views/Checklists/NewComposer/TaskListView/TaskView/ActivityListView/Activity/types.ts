import { Activity } from '../../../../checklist.types';

export interface ActivityProps {
  activity: Activity;
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
