import {
  ChecklistComposerState,
  ChecklistComposerActionType,
  ChecklistComposerAction,
} from './types';

const initialState: ChecklistComposerState = {
  checklist: undefined,
  loading: false,
  error: null,
};

const reducer = (
  state = initialState,
  action: ChecklistComposerActionType,
): ChecklistComposerState => {
  switch (action.type) {
    case ChecklistComposerAction.FETCH_CHECKLIST_ONGOING:
      return { ...state, loading: true };

    case ChecklistComposerAction.FETCH_CHECKLIST_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ChecklistComposerAction.FETCH_CHECKLIST_SUCCESS:
      return { ...state, loading: false, checklist: action.payload?.checklist };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistComposerReducer };
