import { Stage } from './ChecklistComposer/StagesView/types';

export interface Checklist {
  id: number;
  name: string;
  code: string;
  version: number | null;
  stages: Stage[];
}