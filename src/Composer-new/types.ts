import { RouteComponentProps } from '@reach/router';

export enum ChecklistStates {
  BEING_APPROVED = 'BEING_APPROVED',
  BEING_REVIEWED = 'BEING_REVIEWED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

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
