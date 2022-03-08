import { Pageable } from '#utils/globalTypes';
import {
  ChecklistActivity,
  ChecklistActivityAction,
  ChecklistActivityActionType,
  ChecklistActivityState,
} from './types';

export const initialState: ChecklistActivityState = {
  logs: [],
  loading: false,
  pageable: {
    page: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  },
};

const reducer = (
  state = initialState,
  action: ChecklistActivityActionType,
): ChecklistActivityState => {
  switch (action.type) {
    case ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_ONGOING:
      return { ...state, loading: true };

    case ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        pageable: pageable as Pageable,
        logs:
          pageable && pageable.page === 0
            ? (data as Array<ChecklistActivity>)
            : [...state.logs, ...(data as ChecklistActivity[])],
      };

    case ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as checklistActivityReducer };
