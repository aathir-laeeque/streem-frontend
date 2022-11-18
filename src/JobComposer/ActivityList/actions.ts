import { actionSpreader } from '#store';
import { Parameter, Media } from '../checklist.types';
import { ParameterListAction } from './reducer.types';
import { SupervisorResponse, approveRejectParameterType } from './types';

export const executeParameter = (parameter: Parameter, reason?: string) =>
  actionSpreader(ParameterListAction.EXECUTE_PARAMETER_LATEST, {
    parameter,
    reason,
  });

export const fixParameter = (parameter: Parameter, reason?: string) =>
  actionSpreader(ParameterListAction.FIX_PARAMETER_LATEST, { parameter, reason });

export const executeParameterLeading = (parameter: Parameter, reason?: string) =>
  actionSpreader(ParameterListAction.EXECUTE_PARAMETER_LEADING, {
    parameter,
    reason,
  });

export const fixParameterLeading = (parameter: Parameter, reason?: string) =>
  actionSpreader(ParameterListAction.FIX_PARAMETER_LEADING, { parameter, reason });

export const updateExecutedParameter = (parameter: Parameter) =>
  actionSpreader(ParameterListAction.UPDATE_EXECUTED_PARAMETER, {
    parameter,
  });

export const updateMediaParameterSuccess = (media: Media, parameterId: Parameter['id']) =>
  actionSpreader(ParameterListAction.UPDATE_MEDIA_PARAMETER_SUCCESS, {
    media,
    parameterId,
  });

export const setParameterError = (error: any, parameterId: Parameter['id']) =>
  actionSpreader(ParameterListAction.SET_PARAMETER_ERROR, { error, parameterId });

export const removeParameterError = (parameterId: Parameter['id']) =>
  actionSpreader(ParameterListAction.REMOVE_PARAMETER_ERROR, { parameterId });

export const approveRejectParameter = ({ parameterId, jobId, type }: approveRejectParameterType) =>
  actionSpreader(
    type === SupervisorResponse.APPROVE
      ? ParameterListAction.APPROVE_PARAMETER
      : ParameterListAction.REJECT_PARAMETER,
    { parameterId, jobId, type },
  );
