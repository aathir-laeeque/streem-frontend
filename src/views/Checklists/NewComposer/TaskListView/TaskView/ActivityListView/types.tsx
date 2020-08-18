import { setActiveActivity } from './actions';

export interface ActivityListViewProps {
  taskIndex: number;
}

export enum ActivityListActions {
  SET_ACTIVE_ACTIVITY = '@@composer/activity_list/SET_ACTIVE_ACTIVITY',
}

export type ActivityListActionType = ReturnType<typeof setActiveActivity>;
