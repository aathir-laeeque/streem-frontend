import { Stage } from './ChecklistComposer/StageList/types';

export interface Properties {
  [key: string]: string | null;
}

export interface Checklist {
  archived?: boolean;
  code: string;
  id: number;
  name: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  properties?: Properties;
  noOfTasks?: number;
}

export enum ChecklistState {
  ADD_EDIT = 'editing',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
  VIEW = 'viewing',
}
