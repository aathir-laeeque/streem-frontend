import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';

export type UserAccessViewProps = RouteComponentProps;

export interface Properties {
  [key: string]: string | undefined;
}
export interface Job {
  id: number;
  name?: string;
  code: string;
  properties?: Properties;
  checklist: {
    id: number;
    name: string;
  };
  status: string;
  users: User[];
}
