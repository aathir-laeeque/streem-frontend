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
          [action.payload.stageId.toString()]: {
            ...state.activityOrderInTaskInStage[
              action.payload.stageId.toString()
            ],
            [action.payload.taskId.toString()]: [
              ...state.activityOrderInTaskInStage[
                action.payload.stageId.toString()
              ][action.payload.taskId.toString()],
              action.payload.activity.id,
            ],
          },
        },
        listById: {
          ...state.listById,
          [action.payload.activity.id]: action.payload.activity,
        },
      };

    case ActivityListActions.DELETE_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId.toString()]: {
            ...state.activityOrderInTaskInStage[
              action.payload.stageId.toString()
            ],
            [action.payload.taskId.toString()]: [
              ...state.activityOrderInTaskInStage[
                action.payload.stageId.toString()
              ][action.payload.taskId.toString()].filter(
                (el) => el !== action.payload.activityId,
              ),
            ],
          },
        },
        listById: {
          ...omit(state.listById, [action.payload.activityId.toString()]),
        },
      };

    case ActivityListActions.UPDATE_ACTIVITY_SUCCESS:
      return {
        ...state,
        listById: {
          ...state.listById,
          [action.payload.activity.id]: action.payload.activity,
        },
      };

    case TaskListActions.ADD_NEW_TASK_SUCCESS:
      const { newTask, stageId } = action.payload;

      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [stageId.toString()]: {
            ...state.activityOrderInTaskInStage[stageId.toString()],
            [newTask.id.toString()]: newTask.activities.map(
              (activity) => activity.id,
            ),
          },
        },
      };

    case TaskListActions.DELETE_TASK_SUCCESS:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId.toString()]: {
            ...omit(
              state.activityOrderInTaskInStage[
                action.payload.stageId.toString()
              ],
              [action.payload.taskId.toString()],
            ),
          },
        },
      };

    case ActivityListActions.DELETE_ACTIVITY_ERROR:
    case ActivityListActions.UPDATE_ACTIVITY_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return { ...state };
  }
};

export { reducer as activityReducer };
