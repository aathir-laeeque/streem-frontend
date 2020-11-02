import { RouteComponentProps } from '@reach/router';

import { Job } from '../views/Jobs/types';
import { Checklist } from './checklist.types';
import { Error } from '#utils/globalTypes';

export enum Tabs {
  STAGES = 'STAGES',
  ACTIVITY = 'ACTIVITY',
}

export enum Entity {
  JOB = 'Job',
  CHECKLIST = 'Checklist',
}

export enum JobState {
  ASSIGNED = 'ASSIGNED',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  IN_PROGRESS = 'IN_PROGRESS',
  UNASSIGNED = 'UNASSIGNED',
}

export type ComposerProps = RouteComponentProps<{
  id: Checklist['id'] | Job['id'];
}> & {
  entity: Entity;
};

export type FetchDataArgs = {
  id: Checklist['id'] | Job['id'];
  entity: Entity;
  setActive?: boolean;
};

export enum ChecklistErros {
  E101 = 'CHECKLIST_NOT_FOUND',
}

export enum JobErrors {
  E701 = 'JOB_NOT_FOUND',
  E702 = 'JOB_IS_NOT_IN_PROGRESS',
  E703 = 'JOB_ALREADY_COMPLETED',
}

export type ErrorGroups = {
  stagesErrors: Error[];
  tasksErrors: Error[];
  activitiesErrors: Error[];
  signOffErrors: Error[];
};
