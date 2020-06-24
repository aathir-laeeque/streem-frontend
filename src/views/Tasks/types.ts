import { RouteComponentProps } from '@reach/router';

export type TasksViewProps = RouteComponentProps;

export interface Properties {
  [key: string]: string | undefined;
}
export interface Task {
  id: number;
  name: string;
  code: string;
  properties?: Properties;
}
export interface Pageable {
  page: number;
  pageSize: number;
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface TasksObj {
  object: string;
  status: string;
  message: string;
  data: Task[];
  pageable: Pageable;
  errors?: any;
}
