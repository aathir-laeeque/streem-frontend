import { Activity as ActivityType, Stage, Task } from '../checklist.types';

type Activity = ActivityType & {
  hasError: boolean;
  errorMessage?: string;
};

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

export type ActivitiesById = Record<
  Activity['id'],
  Activity & { hasError: boolean; errorMessage?: string }
>;

export type ActivitiesOrderInTaskInStage = Record<
  Stage['id'],
  Record<Task['id'], Activity['id'][]>
>;

export enum ActivityErrors {
  E401 = 'ACTIVITY_INCOMPLETE',
}
