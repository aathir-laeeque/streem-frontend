import { Reducer } from 'redux';
import {
  ComposerReducerState,
  ComposerActionType,
  ComposerAction,
  ComposerState,
} from './composer.types';

import {
  initialState as StageListViewState,
  stageListViewReducer,
} from './stageListView.reducer';

const initialState: ComposerReducerState = {
  checklist: undefined,
  composerState: ComposerState.EDIT,
  error: null,
  loading: false,
  stages: StageListViewState,
};

const reducer: Reducer<ComposerReducerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      return {
        ...state,
        checklist: action.payload.checklist,
        loading: false,
        stages: stageListViewReducer(state.stages, action),
      };

    case ComposerAction.FETCH_CHECKLIST_ERROR:
      return { ...state, error: action.payload.error };

    case ComposerAction.SET_COMPOSER_STATE:
      return { ...state, composerState: action.payload.state };

    case ComposerAction.RESET_COMPOSER:
      return initialState;

    default:
      return state;
  }
};

export { reducer as newComposerReducer };
