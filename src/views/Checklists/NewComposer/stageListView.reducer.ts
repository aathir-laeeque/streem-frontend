import { Reducer } from 'redux';

import { ComposerAction } from './composer.types';
import {
  StageListViewAction,
  StageListViewActionTypes,
  StageListViewState,
} from './stageListView.types';

export const initialState: StageListViewState = {
  list: [],
  activeStageId: undefined,
};

const reducer: Reducer<StageListViewState, StageListViewActionTypes> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      return {
        ...state,
        list: action.payload.checklist?.stages || [],
        activeStageId: (action.payload.checklist?.stages || [])[0].id,
      };

    case StageListViewAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.stageId };

    default:
      return state;
  }
};

export { reducer as stageListViewReducer };
