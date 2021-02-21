import { Job } from '#views/Jobs/NewListView/types';

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
