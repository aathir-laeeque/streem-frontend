import { ComposerAction } from '#Composer/composer.reducer.types';
import { Entity } from '#Composer/composer.types';
import { getStages } from '#Composer/utils';
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
