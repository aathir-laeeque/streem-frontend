import { Stage } from './ChecklistComposer/StageList/types';

export interface Properties {
  [key: string]: string | null;
}

export interface Checklist {
  id: number;
  name: string;
  code: string;
  version: number | null;
  stages?: Stage[];
  noOfTasks?: number;
  archived?: boolean;
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
export interface ChecklistsObj {
  object: string;
  status: string;
  message: string;
  data: Checklist[];
  pageable: Pageable;
  errors?: any;
}
