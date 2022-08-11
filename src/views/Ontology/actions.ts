import { actionSpreader } from '#store/helpers';
import { fetchDataType, fetchListSuccessType, Object, ObjectType, OntologyAction } from './types';

export const fetchObjectTypes = (params: fetchDataType) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPES, { params });

export const fetchObjectTypesSuccess = ({ data, pageable }: fetchListSuccessType<ObjectType>) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPES_SUCCESS, { data, pageable });

export const fetchObjectTypesError = (error: any) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPES_ERROR, { error });

export const fetchObjectType = (id: string) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPE, { id });

export const fetchObjectTypeSuccess = (data?: ObjectType) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPE_SUCCESS, { data });

export const fetchObjectTypeError = (error: any) =>
  actionSpreader(OntologyAction.FETCH_OBJECT_TYPE_ERROR, { error });

export const fetchObjects = (params: fetchDataType) =>
  actionSpreader(OntologyAction.FETCH_OBJECTS, { params });

export const fetchObjectsSuccess = ({ data, pageable }: fetchListSuccessType<Object>) =>
  actionSpreader(OntologyAction.FETCH_OBJECTS_SUCCESS, { data, pageable });

export const fetchObjectsError = (error: any) =>
  actionSpreader(OntologyAction.FETCH_OBJECTS_ERROR, { error });

export const setActiveObject = (object?: Object) =>
  actionSpreader(OntologyAction.SET_ACTIVE_OBJECT, { object });

export const createObject = (object: any, objectTypeId: string, onDone: () => void) =>
  actionSpreader(OntologyAction.CREATE_OBJECT, { object, objectTypeId, onDone });

export const editObject = (
  object: any,
  objectTypeId: string,
  objectId: string,
  onDone: () => void,
) =>
  actionSpreader(OntologyAction.EDIT_OBJECT, {
    object,
    objectTypeId,
    objectId,
    onDone,
  });

export const resetOntology = (keys: string[]) =>
  actionSpreader(OntologyAction.RESET_ONTOLOGY, { keys });

export const archiveObject = (
  id: Object['id'],
  reason: string,
  setFormErrors: (errors?: Error[]) => void,
  collectionName: string,
) =>
  actionSpreader(OntologyAction.ARCHIVE_OBJECT, {
    id,
    reason,
    setFormErrors,
    collectionName,
  });

export const unarchiveObject = (
  id: Object['id'],
  reason: string,
  setFormErrors: (errors?: Error[]) => void,
  collectionName: string,
) =>
  actionSpreader(OntologyAction.UNARCHIVE_OBJECT, {
    id,
    reason,
    setFormErrors,
    collectionName,
  });

export const updateObjectsList = (id: Object['id']) =>
  actionSpreader(OntologyAction.UPDATE_OBJECTS_LIST, { id });
