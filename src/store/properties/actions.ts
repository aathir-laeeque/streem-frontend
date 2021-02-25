import { actionSpreader } from '../helpers';
import {
  fetchPropertiesType,
  fetchPropertiesSuccessType,
  PropertiesAction,
} from './types';

export const fetchProperties = ({ type }: fetchPropertiesType) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES, { type });

export const fetchPropertiesOngoing = () =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ONGOING);

export const fetchPropertiesSuccess = ({
  data,
  type,
}: fetchPropertiesSuccessType) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_SUCCESS, { data, type });

export const fetchPropertiesError = (error: string) =>
  actionSpreader(PropertiesAction.FETCH_PROPERTIES_ERROR, { error });
