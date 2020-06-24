import {
  StageListViewActionType,
  StageListViewAction,
} from './StageListView/types';
import {
  ChecklistComposerAction,
  ChecklistComposerActionType,
  ChecklistComposerState,
} from './types';

const initialState: ChecklistComposerState = {
  activeChecklist: undefined,
  activeStageIndex: 0,
  error: null,
  loading: false,
  stages: [],
};

const reducer = (
  state = initialState,
  action: ChecklistComposerActionType | StageListViewActionType,
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
        stages: action.payload?.checklist.stages,
      };

    case StageListViewAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageIndex: action.payload?.index };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistComposerReducer };
