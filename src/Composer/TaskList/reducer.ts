import { Entity } from '#Composer/composer.types';
import { Reducer } from 'redux';

import { ComposerAction } from '../composer.reducer.types';
import { getTasks } from '../utils';
import { TaskListActionType, TaskListState } from './reducer.types';

export const initialState: TaskListState = {
  activeTaskId: 0,

  tasksById: {},
  tasksOrderInStage: [],
};

const reducer: Reducer<TaskListState, TaskListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      console.log('task list reducer blah blah');

      const { data, entity } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;

      return {
        ...state,
        ...getTasks({ checklist, setActiveTask: true }),
      };

    default:
      return { ...state };
  }
};

export { reducer as taskListReducer };
