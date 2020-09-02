interface Properties {
  [key: string]: string | null;
}

export enum ActivityType {
  MATERIAL = 'MATERIAL',
  INSTRUCTION = 'INSTRUCTION',
  YES_NO = 'YES_NO',
  CHECKLIST = 'CHECKLIST',
  SHOULD_BE = 'SHOULD_BE',
  MEDIA = 'MEDIA',
  MULTISELECT = 'MULTISELECT',
  TEXTBOX = 'TEXTBOX',
  SIGNATURE = 'SIGNATURE',
}

export interface Activity {
  id: number;
  type: ActivityType;
  // TODO: look into type for data in activity
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
  response?: any;
}

export interface Media {
  id: number;
  name: string;
  link: string;
  type: string;
  filename: string;
}

export interface Task {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  hasStop: boolean;
  activities: Activity[];
  medias: Media[];
  timed: boolean;
  period?: number;
}

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  tasks: Task[];
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
