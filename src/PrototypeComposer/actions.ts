import { actionSpreader } from '#store';
import { Error } from '#utils/globalTypes';
import { Parameter } from './Activity/types';
import { Checklist } from './checklist.types';
import { ComposerAction } from './reducer.types';
import { ComposerEntity } from './types';

// BLOCK START : Actions related to composer data fetching
type fetchDataType = {
  id: Checklist['id'];
  entity: ComposerEntity;
  setLoading?: boolean;
};
export const fetchComposerData = ({ id, entity, setLoading = true }: fetchDataType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity, setLoading });

type fetchDataErrorType = {
  error: any;
};
export const fetchComposerDataError = ({ error }: fetchDataErrorType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

type fetchDataOngoingType = {
  entity: ComposerEntity;
};
export const fetchComposerDataOngoing = ({ entity }: fetchDataOngoingType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING, { entity });

type fetchDataSuccessType = {
  data: Checklist;
  entity: ComposerEntity;
};
export const fetchComposerDataSuccess = ({ data, entity }: fetchDataSuccessType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, { data, entity });

export const resetComposer = () => actionSpreader(ComposerAction.RESET_COMPOSER);

export const validatePrototype = (id: Checklist['id']) =>
  actionSpreader(ComposerAction.VALIDATE_PROTOTYPE, { id });

// BLOCK ENDS

export const processParametersMapSuccess = (
  parameters: any[],
  payload: {
    mappedParameters: Record<string, number>;
  },
) => actionSpreader(ComposerAction.PROCESS_PARAMETER_MAP_SUCCESS, { parameters, payload });

export const executeBranchingRulesParameter = (
  parameterValues: Record<string, Parameter>,
  checklistId?: string,
) =>
  actionSpreader(ComposerAction.EXECUTE_LATEST_BRANCHING_RULES, { parameterValues, checklistId });

export const updateHiddenParameterIds = (data: Record<string, Array<string>>[]) =>
  actionSpreader(ComposerAction.UPDATE_HIDDEN_PARAMETER_IDS, { data });

export const setChecklistValidationErrors = (errors: Error[]) =>
  actionSpreader(ComposerAction.SET_CHECKLIST_VALIDATION_ERRORS, { errors });

export const resetChecklistValidationErrors = (id: string, code: string) =>
  actionSpreader(ComposerAction.RESET_CHECKLIST_VALIDATION_ERRORS, { id, code });
