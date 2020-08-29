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
} from './types';

const initialState: ComposerState = {
  data: undefined,
  entity: undefined,
  loading: false,
  isJobStarted: false,
  jobStatus: undefined,
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
          isJobStarted: false,
          jobStatus: action.payload.data.status,
        }),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB:
      return { ...state, isJobStarted: true };

    default:
      return {
        ...state,
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
