import { Reducer } from 'redux';

import { ActivityListAction } from './ActivityList/types';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './reducer.types';
import { StageListAction } from './StageList/types';
import { TaskListAction } from './TaskList/types';
import { ChecklistState, Entity, JobStatus } from './types';
import { transformChecklist } from './utils';

const initialState: ComposerState = {
  checklistState: ChecklistState.CREATING,
  data: undefined,
  entity: undefined,
  entityId: undefined,
  loading: false,
  jobStatus: JobStatus.UNASSIGNED,

  activeStageId: 0,
  activeTaskId: 0,
  activitiesById: {},
  activitiesOrderInTaskInStage: {},
  stagesById: {},
  stagesOrder: [],
  tasksById: {},
  tasksOrderInStage: {},
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA:
      return { ...state, entity: action.payload.entity };

    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { entity, data } = action.payload;
      const {
        activitiesById,
        activitiesOrderInTaskInStage,
        stagesById,
        stagesOrder,
        tasksById,
        tasksOrderInStage,
      } = transformChecklist(
        entity === Entity.CHECKLIST ? data : data?.checklist,
      );

      return {
        ...state,
        data: data,
        entityId: data.id,
        loading: false,

        ...(action.payload.entity === Entity.JOB
          ? { jobStatus: data.status }
          : { checklistState: ChecklistState.CREATING }),

        // new keys
        activeStageId: stagesOrder[0],
        activeTaskId: tasksOrderInStage[stagesOrder[0]][0],
        activitiesById,
        activitiesOrderInTaskInStage,
        stagesById,
        stagesOrder,
        tasksById,
        tasksOrderInStage,
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB_SUCCESS:
      return { ...state, jobStatus: JobStatus.INPROGRESS };

    // case ComposerAction.COMPLETE_JOB:
    //   return { ...state, jobStatus: JobStatus.COMPLETED };

    // BLOCK START
    // actions realted to stage list and stage card
    case StageListAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.id };
    // BLOCKS END

    // BLOCK START
    // actions realted to task list and task view, task card and task media
    case TaskListAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.id };

    case TaskListAction.UPDATE_TASK_EXECUTION_STATUS:
      const taskToUpdate = state.tasksById[action.payload.taskId];

      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...taskToUpdate,
            taskExecution: action.payload.data,
          },
        },
      };

    case TaskListAction.SET_TASK_ERROR:
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [action.payload.taskId]: {
            ...state.tasksById[action.payload.taskId],
            hasError: true,
          },
        },
      };
    // BLOCKS END

    // BLOCK START
    // actions related to activities list and activity
    case ActivityListAction.UPDATE_EXECUTED_ACTIVITY:
      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [action.payload.activity.id]: { ...action.payload.activity },
        },
      };

    case ActivityListAction.SET_ACTIVITY_ERROR:
      const { activityId, error } = action.payload;

      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [activityId]: {
            ...state.activitiesById[activityId],
            hasError: true,
            errorMessage: error.message,
          },
        },
      };

    case ActivityListAction.EXECUTE_ACTIVITY:
      return {
        ...state,
        activitiesById: {
          ...state.activitiesById,
          [action.payload.activity.id]: {
            ...state.activitiesById[action.payload.activity.id],
            hasError: false,
            errorMessage: undefined,
          },
        },

        tasksById: {
          ...state.tasksById,
          [state.activeTaskId]: {
            ...state.tasksById[state.activeTaskId],
            hasError: false,
          },
        },
      };
    // BLOCK END

    default:
      return { ...state };
  }
};

export { reducer as ComposerReducer };
