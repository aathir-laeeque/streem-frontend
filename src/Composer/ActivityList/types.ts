import { Activity as ActivityType, Stage, Task } from '../checklist.types';
import { Job } from '../../views/Jobs/types';

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

export enum SupervisorResponse {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export type approveRejectActivityArgs = {
  jobId: Job['id'];
  activityId: Activity['id'];
  type: SupervisorResponse;
};
