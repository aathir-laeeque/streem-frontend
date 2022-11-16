import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiArchiveObject,
  apiGetObjects,
  apiGetObjectTypes,
  apiUnArchiveObject,
} from '#utils/apiUrls';
import { Error, ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import * as actions from './actions';
import { ObjectType, OntologyAction } from './types';

function* fetchObjectTypesSaga({ payload }: ReturnType<typeof actions.fetchObjectTypes>) {
  try {
    const { params, appendData } = payload;
    const { data, pageable }: ResponseObj<ObjectType[]> = yield call(
      request,
      'GET',
      apiGetObjectTypes(),
      {
        params,
      },
    );

    if (data && pageable) {
      yield put(actions.fetchObjectTypesSuccess({ data, pageable, appendData }));
    }
  } catch (error) {
    console.error('error from fetchObjectTypesSaga function in Ontology Saga :: ', error);
    yield put(actions.fetchObjectTypesError(error));
  }
}

function* fetchObjectTypeSaga({ payload }: ReturnType<typeof actions.fetchObjectType>) {
  try {
    const { id } = payload;
    const { data } = yield call(request, 'GET', apiGetObjectTypes(id));

    if (data) {
      yield put(actions.fetchObjectTypeSuccess(data));
    }
  } catch (error) {
    console.error('error from fetchObjectTypeSaga function in Ontology Saga :: ', error);
    yield put(actions.fetchObjectTypeError(error));
  }
}

function* fetchObjectsSaga({ payload }: ReturnType<typeof actions.fetchObjects>) {
  try {
    const { params } = payload;
    const { data, pageable } = yield call(request, 'GET', apiGetObjects(), {
      params,
    });

    if (data) {
      yield put(actions.fetchObjectsSuccess({ data, pageable }));
    }
  } catch (error) {
    console.error('error from fetchObjectsSaga function in Ontology Saga :: ', error);
    yield put(actions.fetchObjectsError(error));
  }
}

function* objectActionSaga({
  payload,
}: ReturnType<typeof actions.createObject | typeof actions.editObject>) {
  try {
    const isEditing = 'objectId' in payload;
    const { object, objectTypeId, onDone } = payload;
    const { data, errors }: ResponseObj<any> = yield call(
      request,
      isEditing ? 'PATCH' : 'POST',
      apiGetObjects(isEditing ? payload.objectId : undefined),
      { data: { ...object, objectTypeId } },
    );
    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(actions.setActiveObject(data));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: `Object ${isEditing ? 'Updated' : 'created'} successfully`,
      }),
    );

    onDone();
  } catch (e) {
    yield* handleCatch(
      'ObjectsView',
      `objectActionSaga ${'objectId' in payload ? 'Updating' : 'Creating'}`,
      e,
      true,
    );
  }
}

function* archiveObjectSaga({ payload }: ReturnType<typeof actions.archiveObject>) {
  try {
    const { id, reason, setFormErrors, collectionName } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiArchiveObject(id), {
      data: { reason, collectionName },
    });

    if (data) {
      yield put(actions.updateObjectsList(id));
      yield put(
        openOverlayAction({
          type: OverlayNames.ARCHIVE_MODAL,
          props: { mode: 'archive' },
        }),
      );
      setFormErrors(errors);
    } else {
      if ((errors as Error[]).some((error) => error.code === 'E120')) {
        setFormErrors(undefined);
        yield put(
          openOverlayAction({
            type: OverlayNames.ARCHIVE_MODAL,
            props: { mode: 'cannotArchive' },
          }),
        );
      } else {
        setFormErrors(errors);
        console.error('error from apiArchiveObject :: ', errors);
      }
    }
  } catch (error) {
    console.error('error in archiveObjectSaga :: ', error);
  }
}

function* unarchiveObjectSaga({ payload }: ReturnType<typeof actions.unarchiveObject>) {
  try {
    const { id, reason, setFormErrors, collectionName } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiUnArchiveObject(id), {
      data: { reason, collectionName },
    });

    if (data) {
      yield put(actions.updateObjectsList(id));
      yield put(
        openOverlayAction({
          type: OverlayNames.ARCHIVE_MODAL,
          props: { mode: 'unarchive' },
        }),
      );
    } else {
      console.error('error from apiUnarchiveObject :: ', errors);
    }

    setFormErrors(errors);
  } catch (error) {
    console.error('error in unarchiveObjectSaga :: ', error);
  }
}

export function* OntologySaga() {
  yield takeLatest(OntologyAction.FETCH_OBJECT_TYPES, fetchObjectTypesSaga);
  yield takeLatest(OntologyAction.FETCH_OBJECT_TYPE, fetchObjectTypeSaga);
  yield takeLatest(OntologyAction.FETCH_OBJECTS, fetchObjectsSaga);
  yield takeLeading(OntologyAction.CREATE_OBJECT, objectActionSaga);
  yield takeLeading(OntologyAction.EDIT_OBJECT, objectActionSaga);
  yield takeLatest(OntologyAction.ARCHIVE_OBJECT, archiveObjectSaga);
  yield takeLatest(OntologyAction.UNARCHIVE_OBJECT, unarchiveObjectSaga);
}
