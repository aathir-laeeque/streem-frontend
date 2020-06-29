import { omit } from 'lodash';

import { ChecklistState } from '../types';
import { Stage, StageListAction } from './StageList/types';
import { ComposerAction, ComposerActionType, ComposerState } from './types';
import { StepViewAction } from './StepsList/StepView/types';
import { InteractionAction } from './StepsList/StepView/InteractionsList/types';

const initialState: ComposerState = {
  activeStageIndex: 0,
  activeStepIndex: 0,
  checklist: undefined,
  error: null,
  loading: false,
  stages: [],
  steps: null,
  state: ChecklistState.ADD_EDIT,
};

const reducer = (
  state = initialState,
  action: ComposerActionType,
): ComposerState => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      const checklist = action.payload?.checklist;

      return {
        ...state,
        checklist: checklist,
        loading: false,
        stages: checklist?.stages.map((el) => ({ ...omit(el, ['steps']) })),
        steps: checklist?.stages[state.activeStageIndex].steps,
      };

    case ComposerAction.FETCH_CHECKLIST_ERROR:
      return { ...state, error: action.payload?.error, loading: false };

    case ComposerAction.SET_CHECKLIST_STATE:
      return { ...state, state: action.payload?.state };

    case StageListAction.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStageIndex: action.payload?.index,
        steps: state.checklist?.stages[action.payload?.index].steps,
      };

    case StageListAction.UPDATE_STAGE:
      return {
        ...state,
        stages: (state.stages as Array<Stage>).map((el, i) => ({
          ...el,
          ...(i === action.payload?.index && { ...action.payload?.stage }),
        })),
      };

    case StepViewAction.SET_ACTIVE_STEP:
      return { ...state, activeStepIndex: action.payload?.index };

    case InteractionAction.UPDATE_INTERACTION_REDUX:
      return {
        ...state,
        steps: state.steps.map((step, i) => ({
          ...step,
          ...(i === state.activeStepIndex && {
            interactions: step.interactions.map((interaction, j) => ({
              ...(j === action.payload?.index
                ? { ...action.payload?.data }
                : { ...interaction }),
            })),
          }),
        })),
      };

    default:
      return state;
  }
};

export { reducer as composerReducer };
