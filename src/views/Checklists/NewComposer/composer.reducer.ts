import { Reducer } from 'redux';
import {
  ComposerReducerState,
  ComposerActionType,
  ComposerAction,
  ComposerState,
} from './composer.types';

import {
  initialState as StageListViewInitialState,
  stageListViewReducer,
} from './StageListView/reducer';

import {
  initialState as TaskListViewInitialState,
  taskListViewReducer,
} from './TaskListView/reducer';

const initialState: ComposerReducerState = {
  checklist: undefined,
  composerState: ComposerState.EDIT,
  error: null,
  jobId: undefined,
  loading: false,
  stages: StageListViewInitialState,
  tasks: TaskListViewInitialState,
};

const reducer: Reducer<ComposerReducerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA:
      return {
        ...state,
        ...(action.payload.type === 'job' && { jobId: action.payload.id }),
      };

    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      return {
        ...state,
        checklist: action.payload.checklist,
        loading: false,
        stages: stageListViewReducer(state.stages, action),
        tasks: taskListViewReducer(state.tasks, action),
      };

    case ComposerAction.FETCH_COMPOSER_DATA_ERROR:
      return { ...state, error: action.payload.error };

    case ComposerAction.SET_COMPOSER_STATE:
      return { ...state, composerState: action.payload.state };

    case ComposerAction.RESET_COMPOSER:
      return initialState;

    default:
      return {
        ...state,
        stages: stageListViewReducer(state.stages, action),
        tasks: taskListViewReducer(state.tasks, action),
      };
  }
};

export { reducer as newComposerReducer };
