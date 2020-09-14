import { Reducer } from 'redux';

import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './composer.reducer.types';
import { Entity, JobStatus } from './composer.types';
import {
  initialState as stageListState,
  stageListReducer,
} from './StageList/reducer';
import {
  initialState as taskListState,
  taskListReducer,
} from './TaskList/reducer';

const initialState: ComposerState = {
  data: undefined,

  entity: undefined,
  entityId: undefined,

  loading: false,

  jobStatus: JobStatus.UNASSIGNED,

  stages: stageListState,
  tasks: taskListState,
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { entity, data } = action.payload;

      return {
        ...state,
        entity,
        data: data,
        entityId: data.id,
        loading: false,

        ...(entity === Entity.JOB ? { jobStatus: data.status } : {}),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB_SUCCESS:
      return { ...state, jobStatus: JobStatus.INPROGRESS };

    // case ComposerAction.COMPLETE_JOB:
    //   return { ...state, jobStatus: JobStatus.COMPLETED };

    // BLOCK START
    // actions realted to task list and task view, task card and task media
    // case TaskListAction.SET_ACTIVE_TASK:
    //   return { ...state, activeTaskId: action.payload.id };

    // case TaskListAction.UPDATE_TASK_EXECUTION_STATUS:
    //   const taskToUpdate = state.tasksById[action.payload.taskId];

    //   return {
    //     ...state,
    //     tasksById: {
    //       ...state.tasksById,
    //       [action.payload.taskId]: {
    //         ...taskToUpdate,
    //         taskExecution: action.payload.data,
    //       },
    //     },
    //   };

    // case TaskListAction.SET_TASK_ERROR:
    //   return {
    //     ...state,
    //     tasksById: {
    //       ...state.tasksById,
    //       [action.payload.taskId]: {
    //         ...state.tasksById[action.payload.taskId],
    //         hasError: true,
    //       },
    //     },
    //   };
    // BLOCKS END

    // BLOCK START
    // actions related to activities list and activity
    // case ActivityListAction.UPDATE_EXECUTED_ACTIVITY:
    //   return {
    //     ...state,
    //     activitiesById: {
    //       ...state.activitiesById,
    //       [action.payload.activity.id]: { ...action.payload.activity },
    //     },
    //   };

    // case ActivityListAction.SET_ACTIVITY_ERROR:
    //   const { activityId, error } = action.payload;

    //   return {
    //     ...state,
    //     activitiesById: {
    //       ...state.activitiesById,
    //       [activityId]: {
    //         ...state.activitiesById[activityId],
    //         hasError: true,
    //         errorMessage: error.message,
    //       },
    //     },
    //   };

    // case ActivityListAction.EXECUTE_ACTIVITY:
    // case ActivityListAction.FIX_ACTIVITY:
    //   return {
    //     ...state,
    //     activitiesById: {
    //       ...state.activitiesById,
    //       [action.payload.activity.id]: {
    //         ...state.activitiesById[action.payload.activity.id],
    //         hasError: false,
    //         errorMessage: undefined,
    //       },
    //     },

    //     tasksById: {
    //       ...state.tasksById,
    //       [state.activeTaskId]: {
    //         ...state.tasksById[state.activeTaskId],
    //         hasError: false,
    //       },
    //     },
    //   };
    // BLOCK END

    default:
      return {
        ...state,
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
