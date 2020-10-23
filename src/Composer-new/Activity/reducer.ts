import { Job } from '#views/Jobs/types';
import { omit } from 'lodash';
import { Reducer } from 'redux';

import { Checklist } from '../checklist.types';
import { ComposerAction } from '../reducer.types';
import { TaskListActions } from '../Tasks/reducer.types';
import { ComposerEntity } from '../types';
import {
  ActivityListActions,
  ActivityListActionType,
  ActivityListState,
} from './reducer.types';
import { getActivities } from './utils';

export const initialState: ActivityListState = {
  activityOrderInTaskInStage: {},
  listById: {},
};

const reducer: Reducer<ActivityListState, ActivityListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity } = action.payload;

      const isChecklist = entity === ComposerEntity.CHECKLIST;

      const checklist = isChecklist
        ? (data as Checklist)
        : (data as Job).checklist;

      return {
        ...state,
        ...getActivities(checklist),
      };

    case ActivityListActions.ADD_NEW_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.activityOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: [
              ...state.activityOrderInTaskInStage[action.payload.stageId][
                action.payload.taskId
              ],
              action.payload.activity.id,
            ],
          },
        },
        listById: {
          ...state.listById,
          [action.payload.activity.id]: {
            ...action.payload.activity,
            errors: [],
          },
        },
      };

    case ActivityListActions.DELETE_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.activityOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: [
              ...state.activityOrderInTaskInStage[action.payload.stageId][
                action.payload.taskId
              ].filter((el) => el !== action.payload.activityId),
            ],
          },
        },
        listById: {
          ...omit(state.listById, [action.payload.activityId]),
        },
      };

    case ActivityListActions.UPDATE_ACTIVITY_SUCCESS:
      const updatedActivity = action.payload.activity;

      return {
        ...state,
        listById: {
          ...state.listById,
          [updatedActivity.id]: {
            ...updatedActivity,
            errors: [...state.listById[updatedActivity.id].errors],
          },
        },
      };

    case TaskListActions.ADD_NEW_TASK_SUCCESS:
      const { newTask, stageId } = action.payload;

      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [stageId]: {
            ...state.activityOrderInTaskInStage[stageId],
            [newTask.id]: newTask.activities.map((activity) => activity.id),
          },
        },
      };

    case TaskListActions.DELETE_TASK_SUCCESS:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId]: {
            ...omit(state.activityOrderInTaskInStage[action.payload.stageId], [
              action.payload.taskId,
            ]),
          },
        },
      };

    case ActivityListActions.DELETE_ACTIVITY_ERROR:
    case ActivityListActions.UPDATE_ACTIVITY_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    case ActivityListActions.SET_VALIDATION_ERROR:
      const { error } = action.payload;
      const activityIdWithError = action.payload.error.id;
      const activityWithError = state.listById[activityIdWithError];
      return {
        ...state,
        listById: {
          ...state.listById,
          [activityIdWithError]: {
            ...activityWithError,
            errors: [...activityWithError.errors, error],
          },
        },
      };

    case ActivityListActions.RESET_VALIDATION_ERROR:
      return {
        ...state,
        listById: {
          ...state.listById,
          [action.payload.activityId]: {
            ...state.listById[action.payload.activityId],
            errors: [],
          },
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as activityReducer };
