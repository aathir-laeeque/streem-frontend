import { Stage } from '#Composer-new/checklist.types';
import { AllChecklistStates } from '../../Composer-new/checklist.types';

type ChecklistProperty = {
  id: string;
  name: string;
  value: string;
};

export interface Checklist {
  archived?: boolean;
  code: string;
  id: number;
  name: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  properties?: ChecklistProperty[];
  noOfTasks?: number;
  state: AllChecklistStates;
}

export enum ChecklistState {
  ADD_EDIT = 'editing',
  EXECUTING = 'executing',
  EXECUTED = 'executed',
  VIEW = 'viewing',
}
