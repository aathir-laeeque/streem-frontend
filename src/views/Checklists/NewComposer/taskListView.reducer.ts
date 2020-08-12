import { Reducer } from 'redux';
import {
  TaskListViewState,
  TaskListViewActionType,
} from './taskListView.types';
import { ComposerAction } from './composer.types';

export const initialState: TaskListViewState = {
  list: [],
  activeTaskId: undefined,
};

const reducer: Reducer<TaskListViewState, TaskListViewActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      return {
        ...state,
        list: (action.payload.checklist?.stages || [])[0].tasks,
        activeTaskId: (action.payload.checklist?.stages || [])[0].tasks[0].id,
      };

    default:
      return state;
  }
};

export { reducer as taskListViewReducer };
