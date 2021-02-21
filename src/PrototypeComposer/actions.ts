import { actionSpreader } from '#store';

import { Checklist } from './checklist.types';
import { ComposerAction } from './reducer.types';
import { ComposerEntity } from './types';

// BLOCK START : Actions related to composer data fetching
type fetchDataArgs = {
  id: Checklist['id'];
  entity: ComposerEntity;
};
export const fetchComposerData = ({ id, entity }: fetchDataArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity });

type fetchDataErrorArgs = {
  error: any;
};
export const fetchComposerDataError = ({ error }: fetchDataErrorArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

type fetchDataOngoingArgs = {
  entity: ComposerEntity;
};
export const fetchComposerDataOngoing = ({ entity }: fetchDataOngoingArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING, { entity });

type fetchDataSuccessArgs = {
  data: Checklist;
  entity: ComposerEntity;
};
export const fetchComposerDataSuccess = ({
  data,
  entity,
}: fetchDataSuccessArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, { data, entity });

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);

export const validatePrototype = (id: Checklist['id']) =>
  actionSpreader(ComposerAction.VALIDATE_PROTOTYPE, { id });

// BLOCK ENDS
