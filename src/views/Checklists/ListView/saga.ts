import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiArchiveChecklist,
  apiArchiveValidate,
  apiGetChecklists,
  apiUnarchiveChecklist,
} from '#utils/apiUrls';
import { Error, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import { store } from '../../../App';
import { Checklist } from '../types';
import {
  archiveChecklist,
  fetchChecklists,
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
  handlePublishedArchive,
  unarchiveChecklist,
  updateList,
} from './actions';
import { ListViewAction } from './types';

function* fetchChecklistsSaga({ payload }: ReturnType<typeof fetchChecklists>) {
  try {
    const { params, dispatchOngoing } = payload;
    if (params.page === 0 && dispatchOngoing) {
      yield put(fetchChecklistsOngoing());
    }

    const { data, pageable }: ResponseObj<Checklist[]> = yield call(
      request,
      'GET',
      apiGetChecklists(),
      { params },
    );

    yield put(fetchChecklistsSuccess({ data, pageable }));
  } catch (error) {
    console.error(
      'error from fetchChecklist function in ChecklistListViewSaga :: ',
      error,
    );
    yield put(fetchChecklistsError(error));
  }
}

function* archiveChecklistSaga({
  payload,
}: ReturnType<typeof archiveChecklist>) {
  try {
    const { id, reason, setFormErrors } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiArchiveChecklist(id),
      { data: { reason } },
    );

    if (data) {
      yield put(updateList(id));
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
        console.error('error from apiArchiveChecklist :: ', errors);
      }
    }
  } catch (error) {
    console.error('error in archiveChecklist saga :: ', error);
  }
}

function* unarchiveChecklistSaga({
  payload,
}: ReturnType<typeof unarchiveChecklist>) {
  try {
    const { id, reason, setFormErrors } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiUnarchiveChecklist(id),
      { data: { reason } },
    );

    if (data) {
      yield put(updateList(id));
      yield put(
        openOverlayAction({
          type: OverlayNames.ARCHIVE_MODAL,
          props: { mode: 'unarchive' },
        }),
      );
    } else {
      console.error('error from apiUnarchiveChecklist :: ', errors);
    }

    setFormErrors(errors);
  } catch (error) {
    console.error('error in UnarchiveChecklist saga :: ', error);
  }
}

function* handlePublishedArchiveSaga({
  payload,
}: ReturnType<typeof handlePublishedArchive>) {
  try {
    const { id } = payload;

    const { data } = yield call(request, 'GET', apiArchiveValidate(id));

    if (data) {
      yield put(
        openOverlayAction({
          type: OverlayNames.REASON_MODAL,
          props: {
            modalTitle: 'Archive Checklist',
            modalDesc: `Provide details for archiving the checklist`,
            onPrimaryClick: (
              reason: string,
              setFormErrors: (errors?: Error[]) => void,
            ) => {
              store.dispatch(archiveChecklist(id, reason, setFormErrors));
            },
          },
        }),
      );
    } else {
      yield put(
        openOverlayAction({
          type: OverlayNames.ARCHIVE_MODAL,
          props: { mode: 'cannotArchive' },
        }),
      );
    }
  } catch (error) {
    console.error('error came in handlePublishedArchiveSaga :: ', error);
  }
}

export function* ChecklistListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_CHECKLISTS, fetchChecklistsSaga);
  yield takeLatest(
    ListViewAction.FETCH_CHECKLISTS_FOR_LISTVIEW,
    fetchChecklistsSaga,
  );
  yield takeLatest(ListViewAction.ARCHIVE, archiveChecklistSaga);
  yield takeLatest(ListViewAction.UNARCHIVE, unarchiveChecklistSaga);
  yield takeLatest(
    ListViewAction.HANDLE_PUBLISHED_ARCHIVE,
    handlePublishedArchiveSaga,
  );
}
