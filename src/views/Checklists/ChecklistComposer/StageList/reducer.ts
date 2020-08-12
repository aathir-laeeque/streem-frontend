import { Reducer } from 'react';

import { StageListAction, StageListActionType, StageListState } from './types';

export const initialState: StageListState = {
  activeStageId: undefined,
  list: {},
};

const reducer: Reducer<StageListState, StageListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case StageListAction.SET_STAGES:
      return { ...state, list: action.payload.stages };

    case StageListAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.stageId };

    case StageListAction.UPDATE_STAGE:
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.stage.id]: {
            ...state.list[action.payload.stage.id],
            name: action.payload.stage.name,
          },
        },
      };

    default:
      return state;
  }
};

export { reducer as stageListReducer };