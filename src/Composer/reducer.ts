import { Reducer } from 'redux';

import {
  initialState as StageListInitialState,
  stageListReducer,
} from './StageList/reducer';
import {
  initialState as TaskListInitialState,
  taskListReducer,
} from './TaskList/reducer';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
  Entity,
  JobState,
  JobStatus,
} from './types';

const initialState: ComposerState = {
  data: undefined,
  entity: undefined,
  loading: false,
  jobState: JobState.NOT_STARTED,
  jobStatus: JobStatus.UNASSIGNED,
  stages: StageListInitialState,
  tasks: TaskListInitialState,
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
      return {
        ...state,
        data: action.payload.data,
        loading: false,
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),

        ...(action.payload.entity === Entity.JOB && {
          jobStatus: action.payload.data.status,
        }),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB:
    case ComposerAction.RESTART_JOB:
      return { ...state, jobState: JobState.IN_PROGRESS };

    case ComposerAction.COMPLETE_JOB:
      return { ...state, jobState: JobState.COMPLETED };

    case ComposerAction.COMPLETE_JOB_WITH_EXCEPTION:
      return { ...state, jobState: JobState.COMPLETED_WITH_EXCEPTION };

    default:
      return {
        ...state,
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
