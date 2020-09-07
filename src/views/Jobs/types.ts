import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';

export type JobsViewProps = RouteComponentProps;

export interface Properties {
  [key: string]: string | undefined;
}
export interface Job {
  id: number;
  name?: string;
  code: string;
  totalTasks: number;
  completedTasks: number;
  properties?: Properties;
  checklist: {
    id: number;
    name: string;
  };
  status: string;
  assignees: User[];
}
