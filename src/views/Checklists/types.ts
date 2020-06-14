import { Stage } from './ChecklistComposer/StagesView/types';

export interface Properties {
  [key: string]: string | null;
}

export interface Checklist {
  id: string | number;
  name: string;
  code: string;
  noOfTasks: number;
  version: number;
  archived: boolean;
  properties: Properties;
  stages?: Stage[];
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
