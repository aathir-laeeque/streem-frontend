import { omit } from 'lodash';
import { Reducer } from 'redux';

import { fetchDataSuccess } from '../actions';
import { Stage } from '../checklist.types';
import { ComposerAction, Entity } from '../types';
import {
  ListById,
  StageListAction,
  StageListActionType,
  StageListState,
} from './types';

export const initialState: StageListState = {
  // list: {},
  list: [],
  listById: {},
  activeStageId: undefined,
};

const getStages = ({
  payload: { data, entity },
}: ReturnType<typeof fetchDataSuccess>): Stage[] => {
  if (entity === Entity.CHECKLIST) {
    return data?.stages ?? [];
  } else {
    return data?.checklist?.stages ?? [];
  }
};

const reducer: Reducer<StageListState, StageListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const stages = getStages(action);

      return {
        ...state,
        list: stages.map((el) => ({ ...omit(el, ['tasks']) })),
        listById: stages.reduce<ListById>((acc, stage) => {
          acc[stage.id] = stage;
          return acc;
        }, {}),
        activeStageId: stages[0].id,
      };

    case StageListAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.id };

    case StageListAction.ADD_NEW_STAGE:
      return {
        ...state,
        list: [...state.list, action.payload.stage],
      };

    default:
      return state;
  }
};

export { reducer as stageListReducer };
