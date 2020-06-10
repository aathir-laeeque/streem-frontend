import { RouteComponentProps } from '@reach/router';

import {
  loadChecklists,
  loadChecklistsError,
  loadChecklistsOngoing,
  loadChecklistsSuccess,
  setSelectedChecklist,
} from './actions';

export type ChecklistViewProps = RouteComponentProps;

// checklist interfaces
export enum InteractionType {
  MATERIAL = 'material',
  INSTRUCTION = 'instruction',
  MEDIA_IMAGES = 'images',
  MULTIPLE_CHOICE = 'multiplechoice',
  YES_NO = 'yesno',
  CEHCKLIST = 'checklist',
  SHOULD_BE = 'shouldbe',
  COMMENT = 'comment',
  SIGNATURE = 'signature',
}

export interface Interaction {
  type: InteractionType;
  id: string | number;
  name: string;
  data: any[];
}

export interface Step {
  code?: string;
  id: string | number;
  name: string;
  hasStop?: boolean;
  timed?: boolean;
  dueOn?: Date;
  interactions?: Interaction[] | [];
}

export interface Stage {
  code?: string;
  id: string | number;
  name: string;
  steps: Step[] | [];
}

export interface Checklist {
  code?: string;
  id: string | number;
  name: string;
  stages: Stage[] | [];
  version: number | null;
  archived: boolean;
}

// reducers and actions related interfaces and enums
export interface ChecklistViewState {
  readonly checklists: Checklist[] | [];
  readonly selectedChecklist: Checklist | null;
  readonly loading: boolean;
  readonly error: any | null;
}

export enum ChecklistActionTypes {
  LOAD_CHECKLISTS = '@@checklist/LOAD_CHECKLISTS',
  LOAD_CHECKLISTS_ERROR = '@@checklist/LOAD_CHECKLISTS_ERROR',
  LOAD_CHECKLISTS_ONGOING = '@@checklist/LOAD_CHECKLISTS_ONGOING',
  LOAD_CHECKLISTS_SUCCESS = '@@checklist/LOAD_CHECKLISTS_SUCCESS',
  SET_SELECTED_CHECKLIST = '@@checklist/SET_SELECTED_CHECKLIST',
}

export type ChecklistAction = ReturnType<
  | typeof loadChecklists
  | typeof loadChecklistsError
  | typeof loadChecklistsOngoing
  | typeof loadChecklistsSuccess
  | typeof setSelectedChecklist
>;
