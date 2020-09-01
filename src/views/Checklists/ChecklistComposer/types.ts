import { RouteComponentProps } from '@reach/router';

import { Checklist, ChecklistState } from '../types';
import {
  fetchChecklistError,
  fetchChecklistOngoing,
  fetchChecklistSuccess,
  fetchSelectedJob,
  setChecklistState,
  fetchChecklistSuccessSetUsers,
} from './actions';
import { StageListState } from './StageList/types';
import { ActivityListState } from './TaskList/TaskView/ActivityList/types';
import { TaskListState } from './TaskList/types';
import { resetComposer } from './actions';
import { Job } from '../../Jobs/types';
import { Users } from '#store/users/types';

// PROPS TYPE FOR COMPONENT
interface ComposerDefaultProps {
  checklistState?: ChecklistState;
}

interface Props {
  checklistId: string;
  jobId?: string;
}

export type ComposerProps = RouteComponentProps<Props> & ComposerDefaultProps;

// TYPES AND INTERFACES FOR REDUCER
export interface ComposerState {
  activities: ActivityListState;
  checklist?: Checklist;
  // TODO: replace with error object
  error: any;
  isChecklistEditable: boolean;
  jobId?: Job['id'];
  loading: boolean;
  stages: StageListState;
  tasks: TaskListState;
  state: ChecklistState;
  assignees?: Users;
  jobExtras?: any;
}

export enum ComposerAction {
  FETCH_CHECKLIST = '@@composer/FETCH_CHECKLIST',
  FETCH_CHECKLIST_ERROR = '@@composer/FETCH_CHECKLIST_ERROR',
  FETCH_CHECKLIST_ONGOING = '@@composer/FETCH_CHECKLIST_ONGOING',
  FETCH_CHECKLIST_SUCCESS = '@@composer/FETCH_CHECKLIST_SUCCESS',

  RESET_COMPOSER = '@@composer/RESET_COMPOSER',

  SET_CHECKLIST_STATE = '@@composer/SET_CHECKLIST_STATE',

  FETCH_SELSECTED_JOB = '@@compsoer/FETCH_SELSECTED_JOB',

  FETCH_CHECKLIST_SUCCESS_SET_USERS = '@@compsoer/FETCH_CHECKLIST_SUCCESS_SET_USERS',
}

export type ComposerActionType = ReturnType<
  | typeof fetchChecklistError
  | typeof fetchChecklistOngoing
  | typeof fetchChecklistSuccess
  | typeof fetchChecklistSuccessSetUsers
  | typeof setChecklistState
  | typeof fetchSelectedJob
  | typeof resetComposer
>;
