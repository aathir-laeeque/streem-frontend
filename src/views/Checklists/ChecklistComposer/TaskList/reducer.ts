import { Reducer } from 'redux';

import { TaskViewAction } from './TaskView/types';
import { TaskListAction, TaskListActionType, TaskListState } from './types';
import { ActivityAction } from './TaskView/ActivityList/Activity/types';

export const initialState: TaskListState = {
  list: {},
  activeTaskId: undefined,
  activeStageName: '',
  stageOrderPosition: 1,
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case TaskListAction.SET_TASKS:
      return {
        ...state,
        list: action.payload.tasks,
        activeStageName: action.payload.name,
        stageOrderPosition: action.payload.orderTree,
      };

    case TaskViewAction.SET_ACTIVE_TASK:
      return { ...state, activeTaskId: action.payload.taskId };

    case TaskViewAction.UPDATE_TASK:
      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.task.id]: {
            ...state.list[action.payload.task.id],
            ...action.payload.task,
          },
        },
      };

    default:
      return state;
  }
};

export { reducer as tasksListReducer };
