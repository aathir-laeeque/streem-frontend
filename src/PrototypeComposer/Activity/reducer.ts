import { cloneDeep, omit, set } from 'lodash';
import { Reducer } from 'redux';
import { Checklist } from '../checklist.types';
import { ComposerAction } from '../reducer.types';
import { TaskListActions } from '../Tasks/reducer.types';
import { ParameterListActions, ParameterListActionType, ParameterListState } from './reducer.types';
import { getParameters } from './utils';

export const initialState: ParameterListState = {
  parameterOrderInTaskInStage: {},
  listById: {},
  parameters: {
    list: [],
    listLoading: true,
    pageable: {
      page: 0,
      pageSize: 10,
      numberOfElements: 0,
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      empty: true,
    },
  },
};

const reducer: Reducer<ParameterListState, ParameterListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ParameterListActions.TOGGLE_NEW_PARAMETER:
      return { ...state, addParameter: action.payload };

    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data } = action.payload;

      const checklist = data as Checklist;

      return {
        ...state,
        ...getParameters(checklist),
      };

    case ParameterListActions.ADD_NEW_PARAMETER_SUCCESS:
      return {
        ...state,
        parameterOrderInTaskInStage: {
          ...state.parameterOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.parameterOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: [
              ...state.parameterOrderInTaskInStage[action.payload.stageId][action.payload.taskId],
              action.payload.parameter.id,
            ],
          },
        },
        listById: {
          ...state.listById,
          [action.payload.parameter.id]: {
            ...action.payload.parameter,
            errors: [],
          },
        },
      };

    case ParameterListActions.DELETE_PARAMETER_SUCCESS:
      return {
        ...state,
        parameterOrderInTaskInStage: {
          ...state.parameterOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.parameterOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: [
              ...state.parameterOrderInTaskInStage[action.payload.stageId][
                action.payload.taskId
              ].filter((el) => el !== action.payload.parameterId),
            ],
          },
        },
        listById: {
          ...omit(state.listById, [action.payload.parameterId]),
        },
      };

    case ParameterListActions.UPDATE_STORE_PARAMETER: {
      const { updatePath, parameterId, data } = action.payload;

      return {
        ...state,
        listById: {
          ...state.listById,
          [parameterId]: updatePath
            ? cloneDeep({
                ...set(state.listById[parameterId], updatePath, data),
                errors: [],
              })
            : { ...data, errors: [] },
        },
      };
    }

    case ParameterListActions.UPDATE_STORE_MEDIA_PARAMETER: {
      const { parameterId, dataIndex, data } = action.payload;

      return {
        ...state,
        listById: {
          ...state.listById,
          [parameterId]: cloneDeep({
            ...set(state.listById[parameterId], ['data', dataIndex], {
              ...state.listById[parameterId].data[dataIndex],
              ...data,
            }),
            errors: [],
          }),
        },
      };
    }

    case ParameterListActions.REMOVE_STORE_PARAMETER_ITEM: {
      const { parameterId, parameterItemId } = action.payload;
      const parameterToUpdate = state.listById[parameterId];

      return {
        ...state,
        listById: {
          ...state.listById,
          [parameterId]: {
            ...parameterToUpdate,
            data: parameterToUpdate.data.filter(({ id }: { id: string }) => id !== parameterItemId),
          },
        },
      };
    }

    case ParameterListActions.ADD_STORE_PARAMETER_ITEM: {
      const { parameterId, parameterItemData } = action.payload;
      const parameterToUpdate = state.listById[parameterId];
      parameterToUpdate.data.push(parameterItemData);

      return {
        ...state,
        listById: {
          ...state.listById,
          [parameterId]: { ...parameterToUpdate },
        },
      };
    }

    case TaskListActions.REORDER_PARAMETERS:
      return {
        ...state,
        parameterOrderInTaskInStage: {
          ...state.parameterOrderInTaskInStage,
          [action.payload.stageId]: {
            ...state.parameterOrderInTaskInStage[action.payload.stageId],
            [action.payload.taskId]: action.payload.orderedIds,
          },
        },
      };

    case TaskListActions.ADD_NEW_TASK_SUCCESS:
      const { newTask, stageId } = action.payload;

      return {
        ...state,
        parameterOrderInTaskInStage: {
          ...state.parameterOrderInTaskInStage,
          [stageId]: {
            ...state.parameterOrderInTaskInStage[stageId],
            [newTask.id]: newTask.parameters.map((parameter) => parameter.id),
          },
        },
      };

    case TaskListActions.DELETE_TASK_SUCCESS:
      return {
        ...state,
        parameterOrderInTaskInStage: {
          ...state.parameterOrderInTaskInStage,
          [action.payload.stageId]: {
            ...omit(state.parameterOrderInTaskInStage[action.payload.stageId], [
              action.payload.taskId,
            ]),
          },
        },
      };

    case ParameterListActions.DELETE_PARAMETER_ERROR:
    case ParameterListActions.UPDATE_PARAMETER_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    case ParameterListActions.SET_VALIDATION_ERROR:
      const { error } = action.payload;
      const parameterIdWithError = action.payload.error.id;
      const parameterWithError = state.listById[parameterIdWithError];
      return {
        ...state,
        listById: {
          ...state.listById,
          [parameterIdWithError]: {
            ...parameterWithError,
            errors: [...parameterWithError.errors, error],
          },
        },
      };

    case ParameterListActions.FETCH_PARAMETERS:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          listLoading: true,
        },
      };

    case ParameterListActions.FETCH_PARAMETERS_SUCCESS:
      return {
        ...state,
        parameters: {
          list: action.payload.data,
          pageable: action.payload.pageable!,
          listLoading: false,
        },
      };

    case ParameterListActions.FETCH_PARAMETERS_ERROR:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          listLoading: false,
          error: action.payload.error,
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as parameterReducer };
