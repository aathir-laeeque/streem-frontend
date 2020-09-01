import { Reducer } from 'redux';
import { ChecklistState } from '../types';
import {
  initialState as stageListInitialState,
  stageListReducer,
} from './StageList/reducer';
import {
  initialState as taskListInitialState,
  tasksListReducer,
} from './TaskList/reducer';
import {
  initialState as activityListInitialState,
  activityListReducer,
} from './TaskList/TaskView/ActivityList/reducer';
import { ComposerAction, ComposerActionType, ComposerState } from './types';

const initialState: ComposerState = {
  activities: activityListInitialState,
  checklist: undefined,
  error: null,
  isChecklistEditable: true,
  jobId: undefined,
  loading: false,
  stages: stageListInitialState,
  state: ChecklistState.ADD_EDIT,
  tasks: taskListInitialState,
  assignees: undefined,
  jobExtras: undefined,
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_CHECKLIST_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_CHECKLIST_SUCCESS:
      return { ...state, checklist: action.payload.checklist, loading: false };

    case ComposerAction.FETCH_CHECKLIST_SUCCESS_SET_USERS:
      return {
        ...state,
        assignees: action.payload.users,
        jobExtras: action.payload.extras,
      };

    case ComposerAction.FETCH_CHECKLIST_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case ComposerAction.SET_CHECKLIST_STATE:
      return {
        ...state,
        state: action.payload.state,
        isChecklistEditable: action.payload.state === ChecklistState.ADD_EDIT,
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.FETCH_SELSECTED_JOB:
      return { ...state, jobId: action.payload.jobId };

    default:
      return {
        ...state,
        stages: stageListReducer(state.stages, action),
        tasks: tasksListReducer(state.tasks, action),
        activities: activityListReducer(state.activities, action),
      };
  }
};

export { reducer as composerReducer };
