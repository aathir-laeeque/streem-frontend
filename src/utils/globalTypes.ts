import { Validate } from 'react-hook-form';

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

export type ResponseError = {
  code: string;
  field: string;
  ignore: string;
  message: string;
  timestamp: number;
};

export interface ResponseObj<T> {
  object: string;
  state: string;
  message: string;
  data: T;
  pageable: Pageable | null;
  errors?: ResponseError[];
}

export enum ACTIVITY_SELECTIONS {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export type ValidatorProps = {
  functions: Record<string, Validate>;
  messages: Record<string, string>;
};

export type Error = {
  id: string;
  code: string;
  message: string;
  type: string;
};

export type FileUploadData = {
  mediaId: string;
  filename: string;
  originalFilename: string;
  link: string;
  type: string;
};

export type FilterField = {
  field: string;
  op: 'EQ' | 'ANY' | 'LIKE' | 'GT' | 'LT' | 'NE' | 'GOE' | 'LOE';
  values: [string | boolean] | string[];
};

export type ApiFilter = {
  op: 'AND' | 'OR';
  fields: FilterField[];
};
