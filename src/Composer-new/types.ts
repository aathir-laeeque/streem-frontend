import { RouteComponentProps } from '@reach/router';

// TODO: moves this to Jobs view types
export enum JobStates {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  INPROGRESS = 'INPROGRESS',
  UNASSIGNED = 'UNASSIGNED',
}

export enum ComposerEntity {
  CHECKLIST = 'checklist',
  JOB = 'job',
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
