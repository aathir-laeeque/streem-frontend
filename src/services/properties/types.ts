import { ComposerEntity } from '#PrototypeComposer/types';
import { Property } from '#store/properties/types';

import { fetchError, fetchOngoing, fetchSuccess } from './actions';

export type PropertyById = Record<string, Property>;

export type PropertyByName = Record<string, Property>;

export type EntityProperties = {
  list: Property[];
  listById: PropertyById;
  listByName: PropertyByName;
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

export type fetchSuccessType = {
  data: Property[];
  entity: ComposerEntity;
};
