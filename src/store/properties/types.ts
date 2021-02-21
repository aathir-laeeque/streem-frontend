import { ComposerEntity } from '#PrototypeComposer/types';

import {
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
  readonly checklist: Properties;
  readonly error?: string;
  readonly job: Properties;
  readonly loading: boolean;
}

export enum PropertiesAction {
  FETCH_PROPERTIES = '@@properties/FETCH_PROPERTIES',
  FETCH_PROPERTIES_ERROR = '@@properties/FETCH_PROPERTIES_ERROR',
  FETCH_PROPERTIES_ONGOING = '@@properties/FETCH_PROPERTIES_ONGOING',
  FETCH_PROPERTIES_SUCCESS = '@@properties/FETCH_PROPERTIES_SUCCESS',
}

export type PropertiesActionType = ReturnType<
  | typeof fetchPropertiesError
  | typeof fetchPropertiesOngoing
  | typeof fetchPropertiesSuccess
>;

export type usePropertiesArgs = {
  entity: ComposerEntity;
};

export type fetchPropertiesArgs = {
  type: ComposerEntity;
};

export type fetchPropertiesSuccessArgs = {
  data: Property[];
  type: ComposerEntity;
};
