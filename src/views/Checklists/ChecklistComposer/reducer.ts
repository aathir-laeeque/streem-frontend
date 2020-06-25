import { omit } from 'lodash';

import {
  InteractionActions,
  InteractionActionType,
} from './StepsList/StepView/InteractionView/types';
import {
  StepViewActions,
  StepViewActionType,
} from './StepsList/StepView/types';
import { StepsListActions, StepsListActionType } from './StepsList/types';
import { StageListActions, StageListActionType } from './StageList/types';
import {
  ChecklistComposerAction,
  ChecklistComposerActionType,
  ChecklistComposerState,
  ChecklistState,
  TemplateMode,
} from './types';

const initialState: ChecklistComposerState = {
  activeChecklist: undefined,
  activeStageIndex: 0,
  activeStepIndex: 0,
  checklistState: undefined,
  error: null,
  loading: false,
  stages: undefined,
  steps: undefined,
  templateMode: undefined,
};

type redeucerAction =
  | ChecklistComposerActionType
  | StageListActionType
  | StepsListActionType
  | StepViewActionType
  | InteractionActionType;

const reducer = (
  state = initialState,
  action: redeucerAction,
): ChecklistComposerState => {
  switch (action.type) {
    case ChecklistComposerAction.FETCH_CHECKLIST_ONGOING:
      return { ...state, loading: true };

    case ChecklistComposerAction.FETCH_CHECKLIST_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ChecklistComposerAction.FETCH_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        activeChecklist: action.payload?.checklist,
        stages: action.payload?.checklist.stages.map((el) => ({
          ...omit(el, ['steps']),
        })),
      };

    case ChecklistComposerAction.SET_CHECKLIST_MODE:
      return {
        ...state,
        checklistState: action.payload?.checklistState,
        templateMode: action.payload?.templateMode,
      };

    case StageListActions.SET_ACTIVE_STAGE:
      return {
        ...state,
        activeStageIndex: action.payload?.index,
        steps: state.activeChecklist?.stages[action.payload?.index].steps,
      };

    case StageListActions.UPDATE_STAGE_NAME:
      return {
        ...state,
        stages: state.stages?.map((el, i) => ({
          ...el,
          ...(i === action.payload?.index && { name: action.payload?.name }),
        })),
      };

    case StepsListActions.SET_ACTIVE_STEP:
      return { ...state, activeStepIndex: action.payload?.index };

    case StepViewActions.UPDATE_STEP:
      return {
        ...state,
        steps: state?.steps?.map((el, i) => ({
          ...el,
          ...(i === state.activeStepIndex && { ...action.payload }),
        })),
      };

    case InteractionActions.UPDATE_INTERACTIONS:
      return {
        ...state,
        steps: state?.steps?.map((el, i) => ({
          ...el,
          ...(i === state.activeStepIndex && {
            interactions: el.interactions.map((z, ii) => ({
              ...z,
              ...(ii === action.payload?.interactionIndex && {
                ...action.payload?.interaction,
              }),
            })),
          }),
        })),
      };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistComposerReducer };
