import { User } from '#store/users/types';

export type ObjectKeys<T> = keyof T;
export type ObjectValues<T> = T[keyof T];
export type PartialUser = Pick<User, 'employeeId' | 'firstName' | 'id' | 'lastName' | 'archived'>;

export type Audit = {
  createdAt: number;
  modifiedAt: number;
  modifiedBy: PartialUser;
  createdBy: PartialUser;
};

export enum Constraint {
  LT = 'LT', // Date and Number
  GT = 'GT', // Date and Number
  LTE = 'LTE', // Date and Number
  GTE = 'GTE', // Date and Number
  NE = 'NE', // Date and Number
  MIN = 'MIN', // String Length or Choice Count
  MAX = 'MAX', // String Length or Choice Count
  PATTERN = 'PATTERN',
  EQ = 'EQ',
  ANY = 'ANY',
}

export interface Property {
  id: string;
  name: string;
  label: string;
  placeHolder: string;
  mandatory: boolean;
  value: string;
}

export enum Selections {
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
}

export enum ParameterVerificationStatus {
  PENDING = 'PENDING',
  RECALLED = 'RECALLED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export enum SupervisorResponse {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}
