import { Reducer } from 'redux';

import {
  activityReducer,
  initialState as ActivityListState,
} from './Activity/reducer';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './reducer.types';
import {
  initialState as StageListInitialState,
  stageReducer,
} from './Stages/reducer';
import {
  initialState as TaskListInitialState,
  taskReducer,
} from './Tasks/reducer';

const initialState: ComposerState = {
  activities: ActivityListState,
  data: undefined,
  entity: undefined,
  error: undefined,
  loading: false,
  stages: StageListInitialState,
  tasks: TaskListInitialState,
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return {
        ...state,
        entity: action.payload.entity,
        loading: true,
      };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      return {
        ...state,
        activities: activityReducer(state.activities, action),
        data: action.payload.data,
        loading: false,
        stages: stageReducer(state.stages, action),
        tasks: taskReducer(state.tasks, action),
      };

    case ComposerAction.FETCH_COMPOSER_DATA_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case ComposerAction.RESET_COMPOSER:
      return {
        ...initialState,
      };

    default:
      return {
        ...state,
        activities: activityReducer(state.activities, action),
        stages: stageReducer(state.stages, action),
        tasks: taskReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
