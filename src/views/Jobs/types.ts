import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import { Checklist } from '#Composer-new/checklist.types';

export type JobsViewProps = RouteComponentProps;

export interface Properties {
  [key: string]: string | undefined;
}
export interface Job {
  id: string;
  name?: string;
  code: string;
  totalTasks: number;
  completedTasks: number;
  properties?: Properties;
  checklist: Partial<Checklist>;
  state: string;
  assignees: User[];
}
