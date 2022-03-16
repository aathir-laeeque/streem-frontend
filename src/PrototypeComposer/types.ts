import { Error } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';

// TODO: moves this to Jobs view types
export enum JobStates {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  IN_PROGRESS = 'IN_PROGRESS',
  UNASSIGNED = 'UNASSIGNED',
}

export type ReOrderType = {
  from: number;
  id: string;
  to: number;
};

// TODO: merge this as well as Composer type from Job Composer
export enum ComposerEntity {
  CHECKLIST = 'CHECKLIST',
  JOB = 'JOB',
}

export type ComposerProps = RouteComponentProps<{
  id: string;
}> & {
  entity: ComposerEntity;
};

export type ErrorGroups = {
  stagesErrors: Error[];
  tasksErrors: Error[];
  activitiesErrors: Error[];
};
