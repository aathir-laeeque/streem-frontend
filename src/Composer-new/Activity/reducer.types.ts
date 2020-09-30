import { Activity } from '../checklist.types';
import { ComposerActionType } from '../reducer.types';
import { addNewTaskSuccess, deleteTaskSuccess } from '../Tasks/actions';
import {
  addNewActivityError,
  addNewActivitySuccess,
  deleteActivityError,
  deleteActivitySuccess,
  updateActivity,
} from './actions';

export type ActivitiesById = Record<string, Activity>;
export type ActivityOrderInTaskInStage = Record<
  string,
  Record<string, Activity['id'][]>
>;

export type ActivityListState = {
  readonly activityOrderInTaskInStage: ActivityOrderInTaskInStage;
  readonly error?: any;
  readonly listById: ActivitiesById;
};

export enum ActivityListActions {
  ADD_NEW_ACTIVITY = '@@composer/prototype/activity-list/ADD_NEW_ACTIVITY',
  ADD_NEW_ACTIVITY_ERROR = '@@composer/prototype/activity-list/ADD_NEW_ACTIVITY_ERROR',
  ADD_NEW_ACTIVITY_SUCCESS = '@@composer/prototype/activity-list/ADD_NEW_ACTIVITY_SUCCESS',

  DELETE_ACTIVITY = '@@composer/prototype/activity-list/DELETE_ACTIVITY',
  DELETE_ACTIVITY_ERROR = '@@composer/prototype/activity-list/DELETE_ACTIVITY_ERROR',
  DELETE_ACTIVITY_SUCCESS = '@@composer/prototype/activity-list/DELETE_ACTIVITY_SUCCESS',

  UPDATE_ACTIVITY = '@@composer/prototype/activity-list/UPDATE_ACTIVITY',
  UPDATE_ACTIVITY_ERROR = '@@composer/prototype/activity-list/UPDATE_ACTIVITY_ERROR',
  UPDATE_ACTIVITY_SUCCESS = '@@composer/prototype/activity-list/UPDATE_ACTIVITY_SUCCESS',
}

export type ActivityListActionType =
  | ReturnType<
      | typeof addNewActivityError
      | typeof addNewActivitySuccess
      | typeof deleteActivityError
      | typeof deleteActivitySuccess
      | typeof updateActivity
    >
  | ReturnType<typeof addNewTaskSuccess | typeof deleteTaskSuccess>
  | ComposerActionType;
