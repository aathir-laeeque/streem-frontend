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

  stagesById: {},
  stagesOrder: [],
};

const reducer: Reducer<StageListState, StageListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      console.log('stage list reducer blah blah');

      const { data, entity } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getStages({ checklist, setActiveStage: true }),
      };

    case StageListAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStageId: action.payload.id,
      };

    default:
      return { ...state };
  }
};

export { reducer as stageListReducer };
