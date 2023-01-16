import { Error } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';

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
  parametersErrors: Error[];
  otherErrors: Error[];
};
