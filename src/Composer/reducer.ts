import { Reducer } from 'redux';

import { StageListAction } from './StageList/types';
import {
  initialState as TaskListInitialState,
  taskListReducer,
} from './TaskList/reducer';
import {
  ChecklistState,
  ComposerAction,
  ComposerActionType,
  ComposerState,
  Entity,
  JobStatus,
} from './types';
import { transformChecklist } from './utils';

const initialState: ComposerState = {
  checklistState: ChecklistState.CREATING,
  data: undefined,
  entity: undefined,
  entityId: undefined,
  loading: false,
  jobStatus: JobStatus.UNASSIGNED,
  tasks: TaskListInitialState,

  activeStageId: 0,
  activeTaskId: 0,
  activitiesById: {},
  activitiesOrderInTaskInStage: {},
  stagesById: {},
  stagesOrder: [],
  tasksById: {},
  tasksOrderInStage: {},
};

const reducer: Reducer<ComposerState, ComposerActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA:
      return { ...state, entity: action.payload.entity };

    case ComposerAction.FETCH_COMPOSER_DATA_ONGOING:
      return { ...state, loading: true };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { entity, data } = action.payload;
      const {
        activitiesById,
        activitiesOrderInTaskInStage,
        stagesById,
        stagesOrder,
        tasksById,
        tasksOrderInStage,
      } = transformChecklist(
        entity === Entity.CHECKLIST ? data : data?.checklist,
      );

      return {
        ...state,
        data: action.payload.data,
        entityId: action.payload.data.id,
        loading: false,
        tasks: taskListReducer(state.tasks, action),

        ...(action.payload.entity === Entity.JOB
          ? {
              jobStatus: action.payload.data.status,
            }
          : {
              // TODO: make this as per the API response
              checklistState: ChecklistState.CREATING,
            }),

        // new keys
        activeStageId: stagesOrder[0],
        activeTaskId: tasksOrderInStage[stagesOrder[0]][0],
        activitiesById,
        activitiesOrderInTaskInStage,
        stagesById,
        stagesOrder,
        tasksById,
        tasksOrderInStage,
      };

    case ComposerAction.RESET_COMPOSER:
      return { ...initialState };

    case ComposerAction.START_JOB:
    case ComposerAction.RESTART_JOB:
      return { ...state, jobStatus: JobStatus.INPROGRESS };

    case ComposerAction.COMPLETE_JOB:
      return { ...state, jobStatus: JobStatus.COMPLETED };

    case StageListAction.SET_ACTIVE_STAGE:
      return { ...state, activeStageId: action.payload.id };

    default:
      return {
        ...state,
        tasks: taskListReducer(state.tasks, action),
      };
  }
};

export { reducer as ComposerReducer };
