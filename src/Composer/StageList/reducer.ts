import { Reducer } from 'redux';

import { fetchDataSuccess } from '../actions';
import { Stage } from '../checklist.types';
import { ComposerAction, Entity } from '../types';
import { TaskListAction } from '../TaskList/types';
import {
  ListById,
  StageListAction,
  StageListActionType,
  StageListState,
} from './types';

export const initialState: StageListState = {
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
        list: stages,
        listById: stages.reduce<ListById>((acc, stage) => {
          acc[stage.id] = stage;
          return acc;
        }, {}),
        activeStageId: stages[0].id,
      };

    case StageListAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.id };

    case TaskListAction.UPDATE_TASK_EXECUTION_STATUS:
      const activeStage = state.listById[state.activeStageId];

      return {
        ...state,
        listById: {
          ...state.listById,
          [state.activeStageId]: {
            ...activeStage,
            tasks: activeStage.tasks.map((task) => ({
              ...task,
              taskExecution: action.payload.data,
            })),
          },
        },
      };

    default:
      return state;
  }
};

export { reducer as stageListReducer };
