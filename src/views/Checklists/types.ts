import { Stage } from './ChecklistComposer/StageList/types';

export interface Properties {
  [key: string]: string | null;
}

export interface Checklist {
  id: number;
  name: string;
  code: string;
  version: number | null;
  stages?: Stage[];
  noOfJobs?: number;
  archived?: boolean;
  properties?: Properties;
}
