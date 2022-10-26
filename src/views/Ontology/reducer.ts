import { get, set } from 'lodash';
import { EntityBaseState, OntologyAction, OntologyActionType, OntologyState } from './types';

const initialEntityBase = {
  list: [],
  listLoading: true,
  activeLoading: true,
  pageable: {
    page: 0,
    pageSize: 10,
    numberOfElements: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  },
};

const initialState: OntologyState = {
  objectTypes: initialEntityBase,
  objects: initialEntityBase,
};

const reducer = (state = initialState, action: OntologyActionType): OntologyState => {
  const updateKey = (key: keyof OntologyState, value: Partial<EntityBaseState>) => ({
    ...state,
    [key]: { ...state[key], ...value },
  });

  switch (action.type) {
    case OntologyAction.FETCH_OBJECTS:
      return updateKey('objects', { listLoading: true });

    case OntologyAction.FETCH_OBJECT_TYPES:
      return updateKey('objectTypes', { listLoading: true });

    case OntologyAction.FETCH_OBJECT_TYPE:
      return updateKey('objectTypes', { activeLoading: true });

    case OntologyAction.FETCH_OBJECT_TYPES_SUCCESS:
      return updateKey('objectTypes', {
        listLoading: false,
        list: action.payload.data,
        pageable: action.payload.pageable,
      });

    case OntologyAction.FETCH_OBJECT_TYPE_SUCCESS:
      return updateKey('objectTypes', {
        activeLoading: false,
        active: action.payload?.data,
      });

    case OntologyAction.FETCH_OBJECTS_SUCCESS:
      return updateKey('objects', {
        listLoading: false,
        list: action.payload.data,
        pageable: action.payload.pageable,
      });

    case OntologyAction.FETCH_OBJECTS_ERROR:
      return updateKey('objects', {
        listLoading: false,
        activeLoading: false,
        error: action.payload?.error,
      });

    case OntologyAction.FETCH_OBJECT_TYPES_ERROR:
    case OntologyAction.FETCH_OBJECT_TYPE_ERROR:
      return updateKey('objectTypes', {
        listLoading: false,
        activeLoading: false,
        error: action.payload?.error,
      });

    case OntologyAction.SET_ACTIVE_OBJECT:
      return updateKey('objects', {
        activeLoading: false,
        active: action.payload?.object,
      });

    case OntologyAction.RESET_ONTOLOGY:
      return set(state, action.payload.keys, get(initialState, action.payload.keys));

    case OntologyAction.UPDATE_OBJECTS_LIST:
      return updateKey('objects', {
        listLoading: false,
        list: state.objects.list.filter((object) => object.id !== action.payload.id),
      });

    default:
      return { ...state };
  }
};

export { reducer as OntologyReducer };
