import { Stage } from './ChecklistComposer/StageListView/types';

export interface Checklist {
  id: number;
  name: string;
  code: string;
  version: number;
  archived: boolean;
  stages: Stage[];
}
