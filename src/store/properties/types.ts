import { ComposerEntity } from '#PrototypeComposer/types';

import {
  fetchPropertiesError,
  fetchPropertiesOngoing,
  fetchPropertiesSuccess,
} from './actions';

export interface Property {
  id: string;
  name: string;
  placeHolder: string;
  orderTree: number;
  mandatory: boolean;
}

export interface PropertiesState {
  readonly checklist: Property[];
  readonly error?: string;
  readonly job: Property[];
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

export type usePropertiesType = {
  entity: ComposerEntity;
};

export type fetchPropertiesType = {
  type: ComposerEntity;
};

export type fetchPropertiesSuccessType = {
  data: Property[];
  type: ComposerEntity;
};
