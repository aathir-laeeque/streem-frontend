import { RouteComponentProps } from '@reach/router';

import { Job } from '../views/Jobs/types';
import {
  completeJob,
  fetchData,
  fetchDataError,
  fetchDataOngoing,
  fetchDataSuccess,
  publishChecklist,
  resetComposer,
  restartJob,
  startJob,
} from './actions';
import { Activity, Checklist, Stage, Task } from './checklist.types';
import { StageListActionType } from './StageList/types';
import { TaskListActionType } from './TaskList/types';
import { ActivityListActionType } from './ActivityList/types';

export enum Entity {
  JOB = 'Job',
  CHECKLIST = 'Checklist',
}

// Job assignemt status
export enum JobStatus {
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_EXCEPTION = 'COMPLETED_WITH_EXCEPTION',
  INPROGRESS = 'INPROGRESS',
}

export enum ChecklistState {
  CREATING = 'CREATING',
  EDITING = 'EDITING',
  PUBLISHED = 'PUBLISHED',
  REVIEWING = 'REVIEWING',
  VIEWING = 'VIEWING',
}

export type ComposerProps = RouteComponentProps<{
  id: Checklist['id'] | Job['id'];
}> & {
  entity: Entity;
};

export type StagesById = Record<Stage['id'], Omit<Stage, 'tasks'>>;
export type TasksById = Record<
  Task['id'],
  Omit<Task, 'activities'> & { hasError?: boolean; errorMessage?: string }
>;
export type ActivitiesById = Record<Activity['id'], Activity>;

export type StagesOrder = Stage['id'][];
export type TasksOrderInStage = Record<Stage['id'], Task['id'][]>;
export type ActivitiesOrderInTaskInStage = Record<
  Stage['id'],
  Record<Task['id'], Activity['id'][]>
>;

export type ComposerState = {
  checklistState: ChecklistState;
  data?: Checklist | Job;
  entity?: Entity;
  entityId?: Checklist['id'] | Job['id'];
  loading: boolean;
  jobStatus: JobStatus;

  // some new keys
  stagesById: StagesById;
  tasksById: TasksById;
  activitiesById: ActivitiesById;

  stagesOrder: StagesOrder;
  tasksOrderInStage: TasksOrderInStage;
  activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage;

  activeStageId: Stage['id'];
  activeTaskId: Task['id'];
};

export enum ComposerAction {
  FETCH_COMPOSER_DATA = '@@composer/FETCH_COMPOSER_DATA',
  FETCH_COMPOSER_DATA_ERROR = '@@composer/FETCH_COMPOSER_DATA_ERROR',
  FETCH_COMPOSER_DATA_ONGOING = '@@composer/FETCH_COMPOSER_DATA_ONGOING',
  FETCH_COMPOSER_DATA_SUCCESS = '@@composer/FETCH_COMPOSER_DATA_SUCCESS',
  RESET_COMPOSER = '@@composer/RESET_COMPOSER',

  PUBLISH_CHECKLIST = '@@composer/PUBLISH_CHECKLIST',

  COMPLETE_JOB = '@@composer/COMPLETE_JOB',
  RESTART_JOB = '@@composer/RESTART_JOB',
  START_JOB = '@@composer/START_JOB',
}

export type ComposerActionType =
  | ReturnType<
      | typeof fetchData
      | typeof fetchDataError
      | typeof fetchDataOngoing
      | typeof fetchDataSuccess
      | typeof resetComposer
      | typeof publishChecklist
      | typeof startJob
      | typeof completeJob
      | typeof restartJob
    >
  | StageListActionType
  | TaskListActionType
  | ActivityListActionType;

export type FetchDataArgs = {
  id: Checklist['id'] | Job['id'];
  entity: Entity;
};

export enum ChecklistErros {
  E101 = 'CHECKLIST_NOT_FOUND',
}

export enum JobErrors {
  E701 = 'JOB_NOT_FOUND',
  E702 = 'JOB_IS_NOT_IN_PROGRESS',
  E703 = 'JOB_ALREADY_COMPLETED',
}
