import { Reducer } from 'redux';

import { Stage } from './checklist.types';
import { StageListViewActionTypes } from './stageListView.types';
import { ComposerAction } from './composer.types';

export interface StageListViewState {
  list: Stage[] | [];
  activeStage: Stage | undefined;
  activeStageId: Stage['id'] | undefined;
}

export const initialState: StageListViewState = {
  list: [],
  activeStage: undefined,
  activeStageId: undefined,
};

const reducer: Reducer<StageListViewState, StageListViewActionTypes> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      return { ...state, list: action.payload.checklist.stages };

    default:
      return state;
  }
};

export { reducer as stageListViewReducer };
