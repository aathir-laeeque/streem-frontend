// import { ActivityListActions } from './TaskView/ActivityListView/types';
import { Reducer } from 'redux';
import {
  TaskListViewState,
  TaskListViewActionType,
  TaskListAction,
  TaskListById,
} from './types';
import { ComposerAction } from '../composer.types';
import { Task } from '../checklist.types';

export const initialState: TaskListViewState = {
  activeTaskId: 0,
  list: {},
};

const reducer: Reducer<TaskListViewState, TaskListViewActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { stages = [] } = action.payload.checklist;

      const tasksById: TaskListById = {};

      stages.forEach((stage) =>
        (stage.tasks as Array<Task>).forEach(
          (task) => (tasksById[task.id] = task),
        ),
      );

      return {
        ...state,
        activeTaskId: (stages[0].tasks as Array<Task>)[0].id,
        list: tasksById,
      };

    case TaskListAction.UPDATE_TASK:
      return {
        ...state,
        list: {
          ...state.list,
          [state.activeTaskId]: {
            ...state.list[state.activeTaskId],
            ...action.payload.task,
          },
        },
      };

    case TaskListAction.SET_TASK_ACTIVE:
      return { ...state, activeTaskId: action.payload.taskId };

    default:
      return state;
  }
};

export { reducer as taskListViewReducer };
