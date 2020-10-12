import { unionBy } from 'lodash';
import { Reducer } from 'redux';

import {
  activityReducer,
  initialState as ActivityListState,
} from './Activity/reducer';
import { Checklist } from './checklist.types';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './reducer.types';
import { ReviewerState } from './reviewer.types';
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
  reviewers: [],
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
      return { ...state, reviewers: action.payload.data };

    case ComposerAction.REVERT_REVIEWERS_FOR_CHECKLIST:
      return { ...state, reviewers: action.payload.users };

    case ComposerAction.ASSIGN_REVIEWER_TO_CHECKLIST:
      return {
        ...state,
        reviewers: unionBy(
          [{ ...action.payload.user, state: ReviewerState.NOT_STARTED }],
          state.reviewers,
          'id',
        ),
      };

    case ComposerAction.UNASSIGN_REVIEWER_FROM_CHECKLIST:
      return {
        ...state,
        reviewers: state.reviewers.filter(
          (item) => item.id !== action.payload.user.id,
        ),
      };

    case ComposerAction.START_CHECKLIST_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          reviewers: action.payload?.reviewers,
        } as Checklist,
      };

    case ComposerAction.SUBMIT_CHECKLIST_REVIEW_WITH_CR_SUCCESS:
    case ComposerAction.SUBMIT_CHECKLIST_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          reviewers: action.payload?.reviewers,
          comments: action.payload?.comments,
        } as Checklist,
      };

    case ComposerAction.CONTINUE_CHECKLIST_REVIEW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          reviewers: action.payload?.reviewers,
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
