import { InputTypes, Pageable } from '#utils/globalTypes';
import * as actions from './actions';

export type EntityBaseState<T = unknown> = {
  listLoading: boolean;
  activeLoading: boolean;
  pageable: Pageable;
  list: T[];
  active?: T;
  error?: any;
};

export enum Cardinality {
  ONE_TO_ONE = 'ONE_TO_ONE',
  ONE_TO_MANY = 'ONE_TO_MANY',
}

export enum Constraint {
  LT = 'LT', // Date and Number
  GT = 'GT', // Date and Number
  LTE = 'LTE', // Date and Number
  GTE = 'GTE', // Date and Number
  NE = 'NE', // Date and Number
  MIN = 'MIN', // String Length or Choice Count
  MAX = 'MAX', // String Length or Choice Count
  PATTERN = 'PATTERN',
  EQ = 'EQ',
}

export type CommonFields = {
  id: string;
  externalId: string;
  displayName: string;
};

export type Choice = Omit<CommonFields, 'externalId'>;

export type Validation = {
  value: string;
  constraint: Constraint;
  errorMessage: string;
};

// OBJECT TYPE

export type ObjectTypeProperty = CommonFields & {
  placeHolder?: string;
  flags: number;
  sortOrder: number;
  inputType: InputTypes;
  description?: string;
  options?: Choice[];
  validations?: Validation[];
  _options?: Choice[];
};

export type ObjectTypeTarget = {
  type: string;
  cardinality: Cardinality;
  urlPath: string;
};

export type ObjectTypeRelation = CommonFields & {
  usable: boolean;
  target: ObjectTypeTarget;
  sortOrder: number;
  variables?: Record<string, string>;
};

export type ObjectType = CommonFields & {
  collection: string;
  pluralName: string;
  description: string;
  properties: ObjectTypeProperty[];
  relations: ObjectTypeRelation[];
  usageStatus: number;
  updatedAt: number;
  createdAt: number;
};

// OBJECT

export type ObjectProperty = CommonFields & {
  value?: string;
  choices?: Choice[];
};

export type ObjectTarget = CommonFields & {
  type: string;
  collection: string;
};

export type ObjectRelation = CommonFields & {
  targets: ObjectTarget[];
};

export type Object = CommonFields & {
  collection: string;
  objectType?: string;
  properties: ObjectProperty[];
  relations: ObjectRelation[];
  updatedAt: number;
  createdAt: number;
  usageStatus: number;
};

export interface OntologyState {
  readonly objectTypes: EntityBaseState<ObjectType>;
  readonly objects: EntityBaseState<Object>;
}

export enum OntologyAction {
  // LiST
  FETCH_OBJECT_TYPES = '@@ontology/FETCH_OBJECT_TYPES',
  FETCH_OBJECT_TYPES_ERROR = '@@ontology/FETCH_OBJECT_TYPES_ERROR',
  FETCH_OBJECT_TYPES_SUCCESS = '@@ontology/FETCH_OBJECT_TYPES_SUCCESS',
  //SINGLE
  FETCH_OBJECT_TYPE = '@@ontology/FETCH_OBJECT_TYPE',
  FETCH_OBJECT_TYPE_ERROR = '@@ontology/FETCH_OBJECT_TYPE_ERROR',
  FETCH_OBJECT_TYPE_SUCCESS = '@@ontology/FETCH_OBJECT_TYPE_SUCCESS',

  FETCH_OBJECTS = '@@ontology/FETCH_OBJECTS',
  FETCH_OBJECTS_ERROR = '@@ontology/FETCH_OBJECTS_ERROR',
  FETCH_OBJECTS_SUCCESS = '@@ontology/FETCH_OBJECTS_SUCCESS',
  SET_ACTIVE_OBJECT = '@@ontology/SET_ACTIVE_OBJECT',
  CREATE_OBJECT = '@@ontology/CREATE_OBJECT',
  EDIT_OBJECT = '@@ontology/EDIT_OBJECT',
  ARCHIVE_OBJECT = '@@ontology/ARCHIVE_OBJECT',
  UNARCHIVE_OBJECT = '@@ontology/UNARCHIVE_OBJECT',
  UPDATE_OBJECTS_LIST = '@@ontology/UPDATE_OBJECTS_LIST',
  //RESET
  RESET_ONTOLOGY = '@@ontology/RESET_ONTOLOGY',
}

export type OntologyActionType = ReturnType<
  | typeof actions.fetchObjectTypes
  | typeof actions.fetchObjectTypesError
  | typeof actions.fetchObjectTypesSuccess
  | typeof actions.fetchObjectType
  | typeof actions.fetchObjectTypeError
  | typeof actions.fetchObjectTypeSuccess
  | typeof actions.fetchObjects
  | typeof actions.fetchObjectsError
  | typeof actions.fetchObjectsSuccess
  | typeof actions.setActiveObject
  | typeof actions.createObject
  | typeof actions.editObject
  | typeof actions.resetOntology
  | typeof actions.updateObjectsList
>;

export type fetchDataType = {
  facilityId?: string;
  page?: number;
  size?: number;
  usageStatus?: number;
  collection?: string;
  sort?: string;
};

export type fetchListSuccessType<T = unknown> = {
  data: T[];
  pageable: Pageable | null;
};
