import { ComposerEntity } from '#Composer-new/types';

import { fetchError, fetchOngoing, fetchSuccess } from './actions';

export interface Property {
  id: number;
  name: string;
  placeHolder: string;
  orderTree: number;
  mandatory: boolean;
}

export type PropertyById = Record<string, Property>;

export type EntityProperties = {
  list: Property[];
  listById: PropertyById;
};

export interface PropertiesState {
  readonly [ComposerEntity.CHECKLIST]: EntityProperties;
  readonly [ComposerEntity.JOB]: EntityProperties;
  readonly loading: boolean;
  readonly error?: unknown;
}

export enum PropertiesAction {
  FETCH_PROPERTIES = '@@properties-service/FETCH_PROPERTIES',
  FETCH_PROPERTIES_ERROR = '@@properties-service/FETCH_PROPERTIES_ERROR',
  FETCH_PROPERTIES_ONGOING = '@@properties-service/FETCH_PROPERTIES_ONGOING',
  FETCH_PROPERTIES_SUCCESS = '@@properties-service/FETCH_PROPERTIES_SUCCESS',
}

export type PropertiesActionType = ReturnType<
  typeof fetchError | typeof fetchOngoing | typeof fetchSuccess
>;

export type fetchSuccessArgs = {
  data: Property[];
  entity: ComposerEntity;
};
