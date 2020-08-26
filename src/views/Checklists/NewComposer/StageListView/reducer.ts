import { Reducer } from 'redux';

import { ComposerAction } from '../composer.types';
import { Task } from '../checklist.types';
import {
  StageListViewAction,
  StageListViewActionTypes,
  StageListViewState,
  StageListById,
} from './types';

export const initialState: StageListViewState = {
  activeStageId: 0,
  list: {},
  listOrder: [],
};

const reducer: Reducer<StageListViewState, StageListViewActionTypes> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { stages = [] } = action.payload.checklist;

      return {
        ...state,
        activeStageId: stages[0].id,
        list: stages.reduce<StageListById>((acc, stage) => {
          acc[stage.id] = {
            ...stage,
            tasks: (stage.tasks as Array<Task>).map((task) => task.id),
          };
          return acc;
        }, {}),

        listOrder: stages.map((stage) => stage.id),
      };

    case StageListViewAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStageId: action.payload.stageId,
      };

    case StageListViewAction.UPDATE_STAGE:
      const { id: stageId, name } = action.payload.stage;

      return {
        ...state,
        list: { ...state.list, [stageId]: { ...state.list[stageId], name } },
      };

    default:
      return state;
  }
};

export { reducer as stageListViewReducer };
