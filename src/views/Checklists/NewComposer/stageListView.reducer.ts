import { Reducer } from 'redux';

import { ComposerAction } from './composer.types';
import {
  StageListViewAction,
  StageListViewActionTypes,
  StageListViewState,
} from './stageListView.types';

export const initialState: StageListViewState = {
  activeStage: undefined,
  activeStageId: undefined,

  list: [],
  listById: {},
};

const reducer: Reducer<StageListViewState, StageListViewActionTypes> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      const { stages = [] } = action.payload.checklist;

      return {
        ...state,
        activeStage: stages[0],
        activeStageId: stages[0].id,
        list: stages,
        listById: stages.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
      };

    case StageListViewAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStage: state.listById[action.payload.stageId],
        activeStageId: action.payload.stageId,
      };

    default:
      return state;
  }
};

export { reducer as stageListViewReducer };
