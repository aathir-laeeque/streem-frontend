import { cloneDeep, omit, set } from 'lodash';
import { Reducer } from 'redux';
import { Checklist } from '../checklist.types';
import { ComposerAction } from '../reducer.types';
import { TaskListActions } from '../Tasks/reducer.types';
import { ActivityListActions, ActivityListActionType, ActivityListState } from './reducer.types';
import { getActivities } from './utils';

export const initialState: ActivityListState = {
  activityOrderInTaskInStage: {},
  listById: {},
  parameters: {
    list: [],
    listLoading: true,
    pageable: {
      page: 0,
      pageSize: 10,
      numberOfElements: 0,
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      empty: true,
    },
  },
};

const reducer: Reducer<ActivityListState, ActivityListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ActivityListActions.TOGGLE_NEW_PARAMETER:
      return { ...state, addParameter: action.payload };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data } = action.payload;

      const checklist = data as Checklist;

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
              ...state.activityOrderInTaskInStage[action.payload.stageId][action.payload.taskId],
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

    case ActivityListActions.UPDATE_STORE_ACTIVITY: {
      const { updatePath, activityId, data } = action.payload;

      return {
        ...state,
        listById: {
          ...state.listById,
          [activityId]: updatePath
            ? cloneDeep({
                ...set(state.listById[activityId], updatePath, data),
                errors: [],
              })
            : { ...data, errors: [] },
        },
      };
    }

    case ActivityListActions.UPDATE_STORE_MEDIA_ACTIVITY: {
      const { activityId, dataIndex, data } = action.payload;

      return {
        ...state,
        listById: {
          ...state.listById,
          [activityId]: cloneDeep({
            ...set(state.listById[activityId], ['data', dataIndex], {
              ...state.listById[activityId].data[dataIndex],
              ...data,
            }),
            errors: [],
          }),
        },
      };
    }

    case ActivityListActions.REMOVE_STORE_ACTIVITY_ITEM: {
      const { activityId, activityItemId } = action.payload;
      const activityToUpdate = state.listById[activityId];

      return {
        ...state,
        listById: {
          ...state.listById,
          [activityId]: {
            ...activityToUpdate,
            data: activityToUpdate.data.filter(({ id }: { id: string }) => id !== activityItemId),
          },
        },
      };
    }

    case ActivityListActions.ADD_STORE_ACTIVITY_ITEM: {
      const { activityId, activityItemData } = action.payload;
      const activityToUpdate = state.listById[activityId];
      activityToUpdate.data.push(activityItemData);

      return {
        ...state,
        listById: {
          ...state.listById,
          [activityId]: { ...activityToUpdate },
        },
      };
    }

    case TaskListActions.REORDER_ACTIVITIES:
      return {
        ...state,
        activityOrderInTaskInStage: {
          ...state.activityOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.activityOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: action.payload.orderedIds,
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

    case ActivityListActions.FETCH_PARAMETERS:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          listLoading: true,
        },
      };

    case ActivityListActions.FETCH_PARAMETERS_SUCCESS:
      return {
        ...state,
        parameters: {
          list: action.payload.data,
          pageable: action.payload.pageable!,
          listLoading: false,
        },
      };

    case ActivityListActions.FETCH_PARAMETERS_ERROR:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          listLoading: false,
          error: action.payload.error,
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as activityReducer };
