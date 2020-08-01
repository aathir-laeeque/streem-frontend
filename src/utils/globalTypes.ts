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

export interface ResponseObj<T> {
  object: string;
  status: string;
  message: string;
  data: T & T[];
  pageable: Pageable | null;
  errors?: any;
}

export enum ACTIVITY_SELECTIONS {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}
