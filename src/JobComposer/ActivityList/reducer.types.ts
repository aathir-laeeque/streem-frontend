import { ComposerActionType } from '../composer.reducer.types';
import {
  executeParameter,
  fixParameter,
  executeParameterLeading,
  fixParameterLeading,
  removeParameterError,
  setParameterError,
  updateExecutedParameter,
  updateMediaParameterSuccess,
} from './actions';
import { ParametersById, ParametersOrderInTaskInStage } from './types';

export type ParameterListState = {
  parametersById: ParametersById;
  parametersOrderInTaskInStage: ParametersOrderInTaskInStage;
};

export enum ParameterListAction {
  EXECUTE_PARAMETER_LATEST = '@@jobComposer/parameter-list/parameter/EXECUTE_PARAMETER_LATEST',
  UPDATE_EXECUTED_PARAMETER = '@@jobComposer/parameter-list/parameter/UPDATE_EXECUTED_PARAMETER',
  SET_PARAMETER_ERROR = '@@jobComposer/parameter-list/parameter/SET_PARAMETER_ERROR',
  REMOVE_PARAMETER_ERROR = '@@jobComposer/parameter-list/parameter/REMOVE_PARAMETER_ERROR',

  FIX_PARAMETER_LATEST = '@@jobComposer/parameter-list/parameter/FIX_PARAMETER_LATEST',
  APPROVE_PARAMETER = '@@jobComposer/parameter-list/parameter/APPROVE_PARAMETER',
  REJECT_PARAMETER = '@@jobComposer/parameter-list/parameter/REJECT_PARAMETER',

  UPDATE_MEDIA_PARAMETER_SUCCESS = '@@jobComposer/parameter-list/parameter/UPDATE_MEDIA_PARAMETER_SUCCESS',

  EXECUTE_PARAMETER_LEADING = '@@jobComposer/parameter-list/parameter/EXECUTE_PARAMETER_LEADING',
  FIX_PARAMETER_LEADING = '@@jobComposer/parameter-list/parameter/FIX_PARAMETER_LEADING',
}

export type ParameterListActionType =
  | ReturnType<
      | typeof executeParameter
      | typeof fixParameter
      | typeof setParameterError
      | typeof updateExecutedParameter
      | typeof removeParameterError
      | typeof updateMediaParameterSuccess
      | typeof executeParameterLeading
      | typeof fixParameterLeading
    >
  | ComposerActionType;
