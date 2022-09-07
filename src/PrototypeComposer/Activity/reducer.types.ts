import { ComposerActionType } from '../reducer.types';
import { addNewTaskSuccess, deleteTaskSuccess } from '../Tasks/actions';
import {
  addNewActivityError,
  addNewActivitySuccess,
  deleteActivityError,
  deleteActivitySuccess,
  setValidationError,
  updateStoreActivity,
  updateActivityError,
  removeStoreActivityItem,
  addStoreActivityItem,
  updateStoreMediaActivity,
} from './actions';
import { Activity } from './types';

export type ActivitiesById = Record<string, Activity>;
export type ActivityOrderInTaskInStage = Record<string, Record<string, Activity['id'][]>>;

export type ActivityListState = {
  readonly activityOrderInTaskInStage: ActivityOrderInTaskInStage;
  readonly error?: any;
  readonly listById: ActivitiesById;
};

export enum ActivityListActions {
  ADD_NEW_ACTIVITY = '@@prototypeComposer/prototype/activity-list/ADD_NEW_ACTIVITY',
  ADD_NEW_ACTIVITY_ERROR = '@@prototypeComposer/prototype/activity-list/ADD_NEW_ACTIVITY_ERROR',
  ADD_NEW_ACTIVITY_SUCCESS = '@@prototypeComposer/prototype/activity-list/ADD_NEW_ACTIVITY_SUCCESS',
  DELETE_ACTIVITY = '@@prototypeComposer/prototype/activity-list/DELETE_ACTIVITY',
  DELETE_ACTIVITY_ERROR = '@@prototypeComposer/prototype/activity-list/DELETE_ACTIVITY_ERROR',
  DELETE_ACTIVITY_SUCCESS = '@@prototypeComposer/prototype/activity-list/DELETE_ACTIVITY_SUCCESS',
  RESET_VALIDATION_ERROR = '@@prototypeComposer/prototype/activity-list/RESET_VALIDATION_ERROR',
  SET_VALIDATION_ERROR = '@@prototypeComposer/prototype/activity-list/SET_VALIDATION_ERROR',
  UPDATE_ACTIVITY_API = '@@prototypeComposer/prototype/activity-list/UPDATE_ACTIVITY_API',
  UPDATE_ACTIVITY_ERROR = '@@prototypeComposer/prototype/activity-list/UPDATE_ACTIVITY_ERROR',
  UPDATE_STORE_ACTIVITY = '@@prototypeComposer/prototype/activity-list/UPDATE_STORE_ACTIVITY',
  UPDATE_STORE_MEDIA_ACTIVITY = '@@prototypeComposer/prototype/activity-list/UPDATE_STORE_MEDIA_ACTIVITY',
  ADD_STORE_ACTIVITY_ITEM = '@@prototypeComposer/prototype/activity-list/ADD_STORE_ACTIVITY_ITEM',
  REMOVE_STORE_ACTIVITY_ITEM = '@@prototypeComposer/prototype/activity-list/REMOVE_STORE_ACTIVITY_ITEM',
}

export type ActivityListActionType =
  | ReturnType<
      | typeof addNewActivityError
      | typeof addNewActivitySuccess
      | typeof deleteActivityError
      | typeof deleteActivitySuccess
      | typeof setValidationError
      | typeof updateActivityError
      | typeof updateStoreActivity
      | typeof updateStoreMediaActivity
      | typeof addStoreActivityItem
      | typeof removeStoreActivityItem
    >
  | ReturnType<typeof addNewTaskSuccess | typeof deleteTaskSuccess>
  | ComposerActionType;
