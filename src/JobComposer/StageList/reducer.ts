import { ComposerAction } from '#JobComposer/composer.reducer.types';
import { Entity } from '#JobComposer/composer.types';
import { getStages } from '#JobComposer/utils';
import { Reducer } from 'redux';

import {
  StageListAction,
  StageListActionType,
  StageListState,
} from './reducer.types';

export const initialState: StageListState = {
  activeStageId: undefined,

  bringIntoView: false,

  stagesById: {},
  stagesOrder: [],
};

const reducer: Reducer<StageListState, StageListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity, setActive } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getStages({ checklist, setActiveStage: setActive }),
      };

    case StageListAction.FETCH_ACTIVE_STAGE_DATA_SUCCESS:
      const {
        data: { stage, stageReports },
      } = action.payload;
      return {
        ...state,
        stageReports,
        stagesById: {
          ...state.stagesById,
          [stage.id]: stage,
        },
      };

    case StageListAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStageId: action.payload.id,
        bringIntoView: action.payload.bringIntoView,
      };

    default:
      return { ...state };
  }
};

export { reducer as stageListReducer };
