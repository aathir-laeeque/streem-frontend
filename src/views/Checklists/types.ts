import { AllChecklistStates } from '#Composer-new/checklist.types';

type ChecklistProperty = {
  id: string;
  name: string;
  value: string;
};

export interface Checklist {
  archived: boolean;
  code: string;
  id: string;
  name: string;
  noOfJobs: number;
  properties: ChecklistProperty[];
  state: AllChecklistStates;
  version: number | null;
}
