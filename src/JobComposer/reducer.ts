import { Reducer } from 'redux';
import { reduce, unionBy } from 'lodash';
import {
  activityListReducer,
  initialState as activityListState,
} from './ActivityList/reducer';
import {
  ComposerAction,
  ComposerActionType,
  ComposerState,
} from './composer.reducer.types';
import { Entity, JobState } from './composer.types';
import {
  initialState as stageListState,
  stageListReducer,
} from './StageList/reducer';
import {
  initialState as activityState,
  jobActivityReducer,
} from './JobActivity/reducer';
import {
  initialState as taskListState,
  taskListReducer,
} from './TaskList/reducer';
import { User } from '#store/users/types';
import { TaskExecutionState } from './checklist.types';

const initialState: ComposerState = {
  activities: activityListState,

  data: undefined,

  entity: undefined,
  entityId: undefined,

  loading: false,

  jobState: JobState.UNASSIGNED,

  stages: stageListState,
  tasks: taskListState,

  assignees: [],

  activity: activityState,
};

/**
 * TODO: optimize the reducer for rendering process and easy access of the tasks in the stages and activities in tasks. Look into easy access of the taska and stages for error handling and also keep in mind for polling of data
 * ? mabe look into splitting the reducer to smaller parts
 */

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { entity, data } = action.payload;

      return {
        ...state,
        entity,
        data: data,
        entityId: data.id,
        loading: false,

        ...(entity === Entity.JOB ? { jobState: data.state } : {}),
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB_SUCCESS:
      return { ...state, jobState: JobState.IN_PROGRESS };

    case ComposerAction.FETCH_ASSIGNED_USERS_FOR_JOB_SUCCESS:
      return { ...state, assignees: action.payload.data };

    case ComposerAction.REVERT_USERS_FOR_JOB:
      return { ...state, assignees: action.payload.users };

    case ComposerAction.ASSIGN_USER_TO_JOB:
      return {
        ...state,
        assignees: unionBy(
          [
            {
              ...action.payload.user,
              assigned: true,
              completelyAssigned: action.payload.completeltAssigned,
            },
          ],
          state.assignees,
          'id',
        ),
      };
    case ComposerAction.UNASSIGN_USER_FROM_JOB:
      return {
        ...state,
        assignees: state.assignees.filter(
          (item) => item.id !== action.payload.user.id,
        ),
      };
    case ComposerAction.ASSIGN_USERS_TO_JOB_SUCCESS:
      const jobAssigned = state.assignees.filter(
        (item) => item.completelyAssigned,
      );
      const res = reduce(
        state.tasks.tasksById,
        function (result, value, key) {
          let merged: User[];
          if (
            value.taskExecution.state === TaskExecutionState.COMPLETED ||
            value.taskExecution.state ===
              TaskExecutionState.COMPLETED_WITH_CORRECTION ||
            value.taskExecution.state ===
              TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
            value.taskExecution.state === TaskExecutionState.SKIPPED
          ) {
            merged = value.taskExecution.assignees;
          } else {
            const newAssignees = (value.taskExecution.assignees as Array<
              User
            >).filter(
              (item) =>
                item.actionPerformed === false &&
                item.state !== 'SIGNED_OFF' &&
                !action.payload.unassignIds.includes(item.id),
            );
            merged = unionBy(jobAssigned, newAssignees, 'id');
          }
          return {
            ...result,
            [key]: {
              ...value,
              taskExecution: {
                ...value.taskExecution,
                assignees: merged,
              },
            },
          };
        },
        {},
      );
      return {
        ...state,
        tasks: { ...state.tasks, tasksById: res },
        assignees: [],
      };

    case ComposerAction.SIGN_OFF_TASKS_ERROR:
      return { ...state, signOffError: action.payload.error };

    case ComposerAction.SIGN_OFF_TASKS_ERROR_RESET:
      return { ...state, signOffError: undefined };

    default:
      return {
        ...state,
        activities: activityListReducer(state.activities, action),
        stages: stageListReducer(state.stages, action),
        tasks: taskListReducer(state.tasks, action),
        activity: jobActivityReducer(state.activity, action),
      };
  }
};

export { reducer as ComposerReducer };
