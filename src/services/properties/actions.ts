import { ComposerEntity } from '#Composer-new/types';
import { actionSpreader } from '#store';

import { fetchSuccessArgs, PropertiesAction } from './types';

export const fetch = (entity: ComposerEntity) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES, { entity });

export const fetchOngoing = () =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ONGOING);

export const fetchSuccess = (args: fetchSuccessArgs) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_SUCCESS, { ...args });

export const fetchError = (error: any) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ERROR, { error });
