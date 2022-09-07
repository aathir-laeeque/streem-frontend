import { unionBy } from 'lodash';
import { Reducer } from 'redux';

import { activityReducer, initialState as ActivityListState } from './Activity/reducer';
import { Checklist } from './checklist.types';
import { ComposerAction, ComposerActionType, ComposerState } from './reducer.types';
import { CollaboratorState } from './reviewer.types';
import { initialState as StageListInitialState, stageReducer } from './Stages/reducer';
import { initialState as TaskListInitialState, taskReducer } from './Tasks/reducer';
import {
  initialState as auditLogsState,
  checklistAuditLogsReducer,
} from './ChecklistAuditLogs/reducers';

const initialState: ComposerState = {
  activities: ActivityListState,
  data: undefined,
  entity: undefined,
  error: undefined,
  loading: false,
  stages: StageListInitialState,
  tasks: TaskListInitialState,
  collaborators: [],
  approvers: [],
  auditLogs: auditLogsState,
};

/**
 * TODO: optimize the reducer for rendering process and eassy access of the tasks in the stages and activities in tasks
 * ? mabe look into splitting the reducer to smaller parts
 */
const reducer: Reducer<ComposerState, ComposerActionType> = (state = initialState, action) => {
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

    case ComposerAction.FETCH_APPROVERS_SUCCESS:
      return { ...state, approvers: action.payload.data };

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
        collaborators: state.collaborators.filter((item) => item.id !== action.payload.user.id),
      };

    case ComposerAction.UPDATE_FOR_REVIEW_PROCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.checklist,
          collaborators: action.payload.collaborators.length
            ? action.payload.collaborators
            : (state.data as Checklist).collaborators,
          comments: action.payload.comments.length
            ? action.payload.comments
            : (state.data as Checklist).comments,
        } as Checklist,
      };

    default:
      return {
        ...state,
        activities: activityReducer(state.activities, action),
        stages: stageReducer(state.stages, action),
        tasks: taskReducer(state.tasks, action),
        auditLogs: checklistAuditLogsReducer(state.auditLogs, action),
      };
  }
};

export { reducer as ComposerReducer };
