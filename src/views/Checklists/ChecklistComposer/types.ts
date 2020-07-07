import { RouteComponentProps } from '@reach/router';

import { Checklist, ChecklistState } from '../types';
import {
  fetchChecklist,
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  setChecklistState,
} from './actions';
import { StageListState } from './StageList/types';
import { ActivityListState } from './TaskList/TaskView/ActivityList/types';
import { TaskListState } from './TaskList/types';

// PROPS TYPE FOR COMPONENT
interface ComposerDefaultProps {
  checklistState?: ChecklistState;
}

interface Props {
  checklistId: string;
}

export type ComposerProps = RouteComponentProps<Props> & ComposerDefaultProps;

// TYPES AND INTERFACES FOR REDUCER
export interface ComposerState {
  activities: ActivityListState;
  checklist?: Checklist;
  // TODO: replace with error object
  error: any;
  isChecklistEditable: boolean;
  loading: boolean;
  stages: StageListState;
  tasks: TaskListState;
  state: ChecklistState;
}

export enum ComposerAction {
  FETCH_CHECKLIST = '@@checklist/composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@checklist/composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@checklist/composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@checklist/composer/FETCH_CHECKLIST_SUCCESS',

  SET_CHECKLIST_STATE = '@@checklist/composer/SET_CHECKLIST_STATE',
}

export type ComposerActionType = ReturnType<
  | typeof fetchChecklist
  | typeof fetchChecklistError
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistSuccess
  | typeof setChecklistState
>;
