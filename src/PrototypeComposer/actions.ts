import { actionSpreader } from '#store';

import { Checklist } from './checklist.types';
import { ComposerAction } from './reducer.types';
import { ComposerEntity } from './types';

// BLOCK START : Actions related to composer data fetching
type fetchDataType = {
  id: Checklist['id'];
  entity: ComposerEntity;
};
export const fetchComposerData = ({ id, entity }: fetchDataType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity });

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

export const processParametersMapSuccess = (parameters: any[]) =>
  actionSpreader(ComposerAction.PROCESS_PARAMETER_MAP_SUCCESS, { parameters });
