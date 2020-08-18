import { ActivityListActions } from './TaskView/ActivityListView/types';
import { Reducer } from 'redux';
import {
  TaskListViewState,
  TaskListViewActionType,
  TaskListAction,
} from './types';
import { ComposerAction } from '../composer.types';

export const initialState: TaskListViewState = {
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
        activeActivityId: _tasks[0].activities[0].id,
        activeTaskId: _tasks[0].id,
        list: _tasks,
        listById: _tasks.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
      };

    case TaskListAction.SET_TASKS:
      const { tasks } = action.payload;

      return {
        ...state,
        activeActivityId: tasks[0].activities[0].id,
        activeTaskId: tasks[0].id,
        list: tasks,
        listById: tasks.reduce((acc, el) => ({ ...acc, [el.id]: el }), {}),
      };

    case TaskListAction.SET_ACTIVE_TASK:
      return {
        ...state,
        activeTaskId: action.payload.taskId,
        activeActivityId: undefined,
      };

    case ActivityListActions.SET_ACTIVE_ACTIVITY:
      return { ...state, activeActivityId: action.payload.activityId };

    default:
      return state;
  }
};

export { reducer as taskListViewReducer };
