import { actionSpreader } from '../helpers';
import {
  fetchPropertiesArgs,
  fetchPropertiesSuccessArgs,
  PropertiesAction,
} from './types';

export const fetchProperties = ({ type }: fetchPropertiesArgs) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES, { type });

export const fetchPropertiesOngoing = () =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ONGOING);

export const fetchPropertiesSuccess = ({
  data,
  type,
}: fetchPropertiesSuccessArgs) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_SUCCESS, { data, type });

export const fetchPropertiesError = (error: any) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ERROR, { error });
