import { Reducer } from 'redux';
import {
  TaskListViewState,
  TaskListViewActionType,
  TaskListAction,
} from './taskListView.types';
import { ComposerAction } from './composer.types';

export const initialState: TaskListViewState = {
  activeTaskId: undefined,
  list: [],
  listById: {},
};

const reducer: Reducer<TaskListViewState, TaskListViewActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      const { stages = [] } = action.payload.checklist;

      const { tasks: _tasks } = stages[0];

      return {
        ...state,
        activeTaskId: _tasks[0].id,
        list: _tasks,
        listById: _tasks.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
      };

    case TaskListAction.SET_TASKS:
      const { tasks } = action.payload;

      return {
        ...state,
        activeTaskId: tasks[0].id,
        list: tasks,
        listById: tasks.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
      };

    default:
      return state;
  }
};

export { reducer as taskListViewReducer };
