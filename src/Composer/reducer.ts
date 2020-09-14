import { Reducer } from 'redux';

import {
  activityListReducer,
  initialState as activityListState,
} from './ActivityList/reducer';
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
  activities: activityListState,

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
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB_SUCCESS:
      return { ...state, jobStatus: JobStatus.INPROGRESS };

    default:
      return {
        ...state,
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
