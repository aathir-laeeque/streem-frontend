import { Error } from '#utils/globalTypes';
import { Job } from '#views/Jobs/NewListView/types';
import { RouteComponentProps } from '@reach/router';

import { Checklist } from './checklist.types';

export enum Tabs {
  STAGES = 'STAGES',
  ACTIVITY = 'ACTIVITY',
}

export enum Entity {
  JOB = 'Job',
  CHECKLIST = 'Checklist',
}

export const JOB_STAGE_POLLING_TIMEOUT = 60000;

export type ComposerProps = RouteComponentProps<{
  id: Checklist['id'] | Job['id'];
}> & {
  entity: Entity;
};

export type FetchDataType = {
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
