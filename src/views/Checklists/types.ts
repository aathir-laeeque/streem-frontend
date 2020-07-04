import { Stage } from './ChecklistComposer/StageList/types';

export interface Checklist {
  archived?: boolean;
  code: string;
  id: number;
  name: string;
  noOfTasks?: number;
  stages: Stage[];
  version: number | null;
}

export enum ChecklistState {
  ADD_EDIT = 'editing',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
}
