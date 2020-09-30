import {
  fetchProperties,
  fetchPropertiesError,
  fetchPropertiesOngoing,
  fetchPropertiesSuccess,
} from './actions';

export interface Property {
  id: number;
  name: string;
  placeHolder: string;
  orderTree: number;
  mandatory: boolean;
}

export type Properties = Property[];

export interface PropertiesState {
  readonly job: Properties;
  readonly checklist: Properties;
  readonly error?: any;
}

export enum PropertiesAction {
  FETCH_PROPERTIES = '@@properties/FETCH_PROPERTIES',
  FETCH_PROPERTIES_ERROR = '@@properties/FETCH_PROPERTIES_ERROR',
  FETCH_PROPERTIES_ONGOING = '@@properties/FETCH_PROPERTIES_ONGOING',
  FETCH_PROPERTIES_SUCCESS = '@@properties/FETCH_PROPERTIES_SUCCESS',
}

export type PropertiesActionType = ReturnType<
  | typeof fetchProperties
  | typeof fetchPropertiesError
  | typeof fetchPropertiesOngoing
  | typeof fetchPropertiesSuccess
>;
