import { Reducer } from 'redux';
import { JobStateEnum } from '#views/Jobs/NewListView/types';

import {
  activityListReducer,
  initialState as activityListState,
} from './ActivityList/reducer';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './composer.reducer.types';
import { Entity } from './composer.types';
import {
  initialState as stageListState,
  stageListReducer,
} from './StageList/reducer';
import {
  initialState as activityState,
  jobActivityReducer,
} from './JobActivity/reducer';
import {
  initialState as taskListState,
  taskListReducer,
} from './TaskList/reducer';
import { StageListAction } from './StageList/reducer.types';

const initialState: ComposerState = {
  activities: activityListState,

  data: undefined,

  entity: undefined,
  entityId: undefined,

  loading: false,

  jobState: JobStateEnum.UNASSIGNED,

  stages: stageListState,
  tasks: taskListState,

  assignees: [],

  activity: activityState,
};

/**
 * TODO: optimize the reducer for rendering process and easy access of the tasks in the stages and activities in tasks. Look into easy access of the taska and stages for error handling and also keep in mind for polling of data
 * ? mabe look into splitting the reducer to smaller parts
 */

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

        ...(entity === Entity.JOB ? { jobState: data.state } : {}),
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case StageListAction.FETCH_ACTIVE_STAGE_DATA_SUCCESS:
      const {
        data: { jobState },
      } = action.payload;
      return {
        ...state,
        jobState,
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };

    case ComposerAction.START_JOB_SUCCESS:
      return { ...state, jobState: JobStateEnum.IN_PROGRESS };

    case ComposerAction.SIGN_OFF_TASKS_ERROR:
      return { ...state, signOffError: action.payload.error };

    case ComposerAction.SIGN_OFF_TASKS_ERROR_RESET:
      return { ...state, signOffError: undefined };

    default:
      return {
        ...state,
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
        activity: jobActivityReducer(state.activity, action),
      };
  }
};

export { reducer as ComposerReducer };
