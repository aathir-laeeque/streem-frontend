import {
  ChecklistViewState,
  ChecklistAction,
  ChecklistActionTypes,
} from './types';

const initialState: ChecklistViewState = {
  checklists: [],
  selectedChecklist: null,
  loading: false,
  error: null,
};

const reducer = (
  state = initialState,
  action: ChecklistAction,
): ChecklistViewState => {
  switch (action.type) {
    case ChecklistActionTypes.LOAD_CHECKLISTS_ONGOING:
      return { ...state, loading: true };

    case ChecklistActionTypes.LOAD_CHECKLISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        checklists: action.payload?.checklists || [],
      };

    case ChecklistActionTypes.LOAD_CHECKLISTS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ChecklistActionTypes.SET_SELECTED_CHECKLIST:
      return {
        ...state,
        selectedChecklist:
          state.checklists.find(
            (el) => el.id === action.payload?.checklistId,
          ) || null,
      };

    default:
      return { ...initialState };
  }
};

export { reducer as ChecklistReducer };
