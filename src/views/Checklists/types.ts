import { Stage } from './ChecklistComposer/StageList/types';

export interface Checklist {
  archived?: boolean;
  code: string;
  id: number;
  name: string;
  noOfTasks?: number;
  // properties?: Properties;
  stages: Stage[];
  version: number | null;
}

export enum ChecklistState {
  ADD_EDIT = 'add/edit',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
}
