import { Parameter } from '#JobComposer/checklist.types';
import { StageListAction } from '#JobComposer/StageList/reducer.types';
import { getParameters } from '#JobComposer/utils';
import { Reducer } from 'redux';
import { ComposerAction } from '../composer.reducer.types';
import { Entity } from '../composer.types';
import { keyBy } from 'lodash';
import { ParameterListAction, ParameterListActionType, ParameterListState } from './reducer.types';

export const initialState: ParameterListState = {
  parametersById: {},
  parametersOrderInTaskInStage: {},
  parametersMappedToJobById: {},
  hiddenIds: {},
};

const reducer: Reducer<ParameterListState, ParameterListActionType> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ComposerAction.FETCH_COMPOSER_DATA_SUCCESS:
      const { data, entity } = action.payload;

      const checklist = entity === Entity.CHECKLIST ? data : data?.checklist;
      return {
        ...state,
        ...getParameters({ checklist }),
        parametersMappedToJobById: keyBy(data?.parameterValues, 'id'),
      };

    case StageListAction.FETCH_ACTIVE_STAGE_DATA_SUCCESS:
      const {
        data: { parametersById: updatedParametersById },
      } = action.payload;

      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          ...updatedParametersById,
        },
      };

    case ParameterListAction.UPDATE_EXECUTED_PARAMETER:
      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          [action.payload.parameter.id]: { ...action.payload.parameter },
          ...(action.payload.parameter?.hide || []).reduce<Record<string, Parameter>>(
            (acc, pId) => {
              acc[pId] = {
                ...state.parametersById[pId],
                response: {
                  ...state.parametersById[pId].response,
                  hidden: true,
                },
              };
              return acc;
            },
            {},
          ),
          ...(action.payload.parameter?.show || []).reduce<Record<string, Parameter>>(
            (acc, pId) => {
              acc[pId] = {
                ...state.parametersById[pId],
                response: {
                  ...state.parametersById[pId].response,
                  hidden: false,
                },
              };
              return acc;
            },
            {},
          ),
        },
      };

    case ParameterListAction.UPDATE_MEDIA_PARAMETER_SUCCESS:
      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          [action.payload.parameterId]: {
            ...state.parametersById[action.payload.parameterId],
            response: {
              ...state.parametersById[action.payload.parameterId].response,
              medias: [
                ...state.parametersById[action.payload.parameterId].response?.medias.filter(
                  (media) => media.id !== action.payload.media.id,
                ),
                action.payload.media,
              ],
            },
          },
        },
      };

    case ParameterListAction.SET_PARAMETER_ERROR:
      const { parameterId, error } = action.payload;

      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          [parameterId]: {
            ...state.parametersById[parameterId],
            hasError: true,
            errorMessage: error.message,
          },
        },
      };

    case ParameterListAction.REMOVE_PARAMETER_ERROR:
      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          [action.payload.parameterId]: {
            ...state.parametersById[action.payload.parameterId],
            hasError: false,
            errorMessage: '',
          },
        },
      };

    case ParameterListAction.EXECUTE_PARAMETER_LATEST:
    case ParameterListAction.FIX_PARAMETER_LATEST:
    case ParameterListAction.EXECUTE_PARAMETER_LEADING:
    case ParameterListAction.FIX_PARAMETER_LEADING:
      return {
        ...state,
        parametersById: {
          ...state.parametersById,
          [action.payload.parameter.id]: {
            ...state.parametersById[action.payload.parameter.id],
            hasError: false,
            errorMessage: undefined,
          },
        },
      };

    default:
      return { ...state };
  }
};

export { reducer as parameterListReducer };
