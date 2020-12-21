import { Pageable } from '#utils/globalTypes';
import { Checklist } from '../types';
import { ListViewAction, ListViewActionType, ListViewState } from './types';

const initalPageable = {
  page: 0,
  pageSize: 10,
  numberOfElements: 0,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: true,
  empty: true,
};

const initialState: ListViewState = {
  checklists: [],
  loading: false,
  pageable: initalPageable,
};

/**
 * TODO: optimize the reducer for Published and prototype tabs
 */

const reducer = (
  state = initialState,
  action: ListViewActionType,
): ListViewState => {
  switch (action.type) {
    case ListViewAction.FETCH_CHECKLISTS_ONGOING:
      return { ...state, loading: true };

    case ListViewAction.CLEAR_DATA:
      return { ...state, checklists: [], pageable: initalPageable };

    case ListViewAction.FETCH_CHECKLISTS_SUCCESS:
      const { data, pageable } = action.payload;
      return {
        ...state,
        loading: false,
        pageable: pageable as Pageable,
        checklists:
          pageable && pageable.page === 0
            ? (data as Array<Checklist>)
            : [...state.checklists, ...(data as Array<Checklist>)],
      };

    case ListViewAction.FETCH_CHECKLISTS_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    case ListViewAction.UPDATE_LIST:
      return {
        ...state,
        checklists: state.checklists.filter(
          (checklist) => checklist.id !== action.payload.id,
        ),
      };

    default:
      return { ...state };
  }
};

export { reducer as ChecklistListViewReducer };
