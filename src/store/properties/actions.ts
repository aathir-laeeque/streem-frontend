import { PropertiesAction, Properties } from './types';
import { actionSpreader } from '../helpers';

export const fetchProperties = (params: Record<string, string>) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES, params);

export const fetchPropertiesOngoing = () =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ONGOING);

export const fetchPropertiesSuccess = (properties: Properties, type: string) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_SUCCESS, {
    properties,
    type,
  });

export const fetchPropertiesError = (error: any) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ERROR, { error });
