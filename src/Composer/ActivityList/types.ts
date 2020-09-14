import { Activity, Stage, Task } from '../checklist.types';

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

export type ActivitiesById = Record<Activity['id'], Activity>;
export type ActivitiesOrderInTaskInStage = Record<
  Stage['id'],
  Record<Task['id'], Activity['id'][]>
>;

export enum ActivityErrors {
  E401 = 'ACTIVITY_INCOMPLETE',
}
