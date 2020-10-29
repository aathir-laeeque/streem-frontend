import Composer from '#Composer-new';
import { unionBy } from 'lodash';
import { Reducer } from 'redux';

import {
  activityReducer,
  initialState as ActivityListState,
} from './Activity/reducer';
import { Checklist, ChecklistStates } from './checklist.types';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './reducer.types';
import { CollaboratorState } from './reviewer.types';
import {
  initialState as StageListInitialState,
  stageReducer,
} from './Stages/reducer';
import {
  initialState as TaskListInitialState,
  taskReducer,
} from './Tasks/reducer';

const initialState: ComposerState = {
  activities: ActivityListState,
  data: undefined,
  entity: undefined,
  error: undefined,
  loading: false,
  stages: StageListInitialState,
  tasks: TaskListInitialState,
  collaborators: [],
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return {
        ...state,
        entity: action.payload.entity,
        loading: true,
      };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      return {
        ...state,
        activities: activityReducer(state.activities, action),
        data: action.payload.data,
        loading: false,
        stages: stageReducer(state.stages, action),
        tasks: taskReducer(state.tasks, action),
      };

    case ComposerAction.FETCH_COMPOSER_DATA_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    case ComposerAction.RESET_COMPOSER:
      return {
        ...initialState,
      };

    case ComposerAction.FETCH_REVIEWERS_FOR_CHECKLIST_SUCCESS:
      return { ...state, collaborators: action.payload.data };

    case ComposerAction.REVERT_REVIEWERS_FOR_CHECKLIST:
      return { ...state, collaborators: action.payload.users };

    case ComposerAction.ASSIGN_REVIEWER_TO_CHECKLIST:
      return {
        ...state,
        collaborators: unionBy(
          [{ ...action.payload.user, state: CollaboratorState.NOT_STARTED }],
          state.collaborators,
          'id',
        ),
      };

    case ComposerAction.UNASSIGN_REVIEWER_FROM_CHECKLIST:
      return {
        ...state,
        collaborators: state.collaborators.filter(
          (item) => item.id !== action.payload.user.id,
        ),
      };

    case ComposerAction.SUBMIT_CHECKLIST_FOR_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          status: ChecklistStates.SUBMITTED_FOR_REVIEW,
          reviewCycle: (state.data as Checklist).reviewCycle + 1,
        } as Checklist,
      };

    case ComposerAction.ASSIGN_REVIEWERS_TO_CHECKLIST_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          status: ChecklistStates.SUBMITTED_FOR_REVIEW,
        } as Checklist,
      };

    case ComposerAction.SEND_REVIEW_TO_CR_SUCCESS:
    case ComposerAction.START_CHECKLIST_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          collaborators: action.payload?.collaborators,
        } as Checklist,
      };

    case ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS:
    case ComposerAction.SUBMIT_CHECKLIST_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          collaborators: action.payload?.collaborators,
          comments: action.payload?.comments,
        } as Checklist,
      };

    case ComposerAction.UPDATE_CHECKLIST_STATE:
      return {
        ...state,
        data: {
          ...state.data,
          status: action.payload.state,
        } as Checklist,
      };

    default:
      return {
        ...state,
        activities: activityReducer(state.activities, action),
        stages: stageReducer(state.stages, action),
        tasks: taskReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
